import * as fs from 'node:fs';
import { readFile } from 'node:fs/promises';
import * as path from 'node:path';
import { setTimeout } from 'node:timers/promises';
import { createHash } from 'node:crypto';

import axios from 'axios';
import type { ResponseType } from 'axios';
import jsonwebtoken from 'jsonwebtoken';
import mime from 'mime';

import * as settings from './settings';
import { makeUUID } from './utils';
import { uploadViaTus } from './tus';

const API_URL = `http://${settings.MICROSERVICE}:${settings.PORT}`;
const UUID_REGEXP = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const TIMESTAMP_REGEXP = /^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3,6}Z$/;
const NIL_UUID = '00000000-0000-0000-0000-000000000000';
const TEST_TIMEOUT_UPLOAD = 5 * 60 * 1000;

const cloudflareApi = axios.create({
  baseURL: API_URL,
  timeout: 60 * 1000,
  validateStatus: null
});

const makeJwt = (...permissions: string[]) => {
  return jsonwebtoken.sign(
    {
      iss: 'CUBE',
      sub: NIL_UUID,
      aud: permissions
    },
    settings.JWT_TOKEN_SECRET
  );
};

const getAuthReqOpts = (...permissions: string[]) => {
  return getReqOptsWithJwt(makeJwt(...permissions));
};

const getReqOptsWithJwt = (jwt: string) => ({ headers: { Authorization: `Bearer ${jwt}` } });

test(
  'uploads video via TUS',
  async () => {
    // First, we have a long-running TUS upload.
    // Then we are waiting for a real video to get encoded over at Cloudflare.
    // Both things will take some real wall clock time.
    jest.useRealTimers();

    const meta = {
      profileId: NIL_UUID,
      allocVidTime: 31,
      validFor: 5 * 60,
      type: 'video/mp4',
      name: 'Test Video',
      filetype: 'video/mp4'
    };

    // See https://file-examples.com/
    // See /services/cloudflare/test/scripts/download_example_files.sh
    const filePath = `${__dirname}/../example-files/file_example_MP4_480_1_5MG.mp4`;
    const fileId = makeUUID();

    const uploadTusEndpoint = new URL(`${API_URL}/upload/video-tus-reservation`);
    uploadTusEndpoint.searchParams.set('fileId', fileId);
    uploadTusEndpoint.searchParams.set('authorization', makeJwt('contentEditor'));

    await uploadViaTus(uploadTusEndpoint.toString(), filePath, meta);

    let detailStatus,
      detailData: any = {};
    for (let i = 0; i < 20; i++) {
      console.log('Checking if file is available ... ');
      ({ status: detailStatus, data: detailData } = await cloudflareApi.get(
        `/files/${fileId}`,
        getAuthReqOpts('anonymous')
      ));

      if (409 === detailStatus) {
        await setTimeout(5 * 1000, 'Wait a moment!');
      } else {
        expect(detailStatus).toEqual(200);
        break;
      }
    }

    expect(detailStatus).toEqual(200);
    expect(detailData).toEqual(
      expect.objectContaining({
        id: fileId,
        createdAt: expect.stringMatching(TIMESTAMP_REGEXP),
        updatedAt: expect.stringMatching(TIMESTAMP_REGEXP),
        storageType: expect.stringMatching(/^cloudflareStream$/),
        playerInfo: expect.anything()
      })
    );

    expect(detailData?.playerInfo).toEqual(
      expect.objectContaining({
        hlsUrl: expect.any(String),
        dashUrl: expect.any(String),
        videoIdOrSignedUrl: expect.any(String)
      })
    );
  },
  TEST_TIMEOUT_UPLOAD
);

test(
  'uploads non-video via S3 presigned URL',
  async () => {
    // See https://file-examples.com/
    // See /services/cloudflare/test/scripts/download_example_files.sh
    const filePath = `${__dirname}/../example-files/file_example_MP3_700KB.mp3`;
    const fileName = path.basename(filePath);
    const mimeType = mime.getType(filePath) || 'application/octet-stream';
    let fileLength;

    function getFileSize(callback: any) {
      fs.stat(filePath, (err, stats) => {
        const fileSize = stats.size;
        callback(fileSize);
      });
    }

    getFileSize((fileSize: any) => {
      fileLength = fileSize;
    });

    const requestBody = {
      profileId: NIL_UUID,
      upload: {
        fileName,
        fileSizeBytes: fileLength,
        mimeType,
        urlValidDurationSeconds: 5 * 60
      }
    };

    const r2SignResponse = await cloudflareApi.post(
      '/upload/s3-presigned-url',
      requestBody,
      getAuthReqOpts('contentEditor')
    );

    const { status: r2SignStatus, data: r2SignData } = r2SignResponse;

    expect(r2SignStatus).toEqual(201);
    expect(r2SignData).toEqual(
      expect.objectContaining({
        fileId: expect.stringMatching(UUID_REGEXP),
        presignedUrl: expect.any(String)
      })
    );

    const fileId = r2SignData.fileId;
    const r2PutOptions = {
      timeout: 10 * 1000,
      validateStatus: null,
      headers: {
        'Content-Type': mimeType,
        'Content-Length': fileLength
      }
    };

    const fileStream = fs.createReadStream(filePath);

    console.log('before R2 upload', r2SignData.presignedUrl);
    let r2UploadResponse;
    try {
      r2UploadResponse = await axios.put(r2SignData.presignedUrl, fileStream, r2PutOptions);
    } catch (err: any) {
      console.error(err);
    }

    console.log('after R2 upload', r2SignData.presignedUrl);
    expect(r2UploadResponse?.status).toEqual(200);

    const detailResponse = await cloudflareApi.get(`/files/${fileId}`, getAuthReqOpts('anonymous'));

    expect(detailResponse.status).toEqual(200);
    expect(detailResponse.data).toEqual(
      expect.objectContaining({
        id: expect.stringMatching(UUID_REGEXP),
        createdAt: expect.stringMatching(TIMESTAMP_REGEXP),
        updatedAt: expect.stringMatching(TIMESTAMP_REGEXP),
        storageType: expect.stringMatching(/^cloudflareR2$/),
        playerInfo: expect.anything()
      })
    );

    expect(detailResponse.data?.playerInfo).toEqual(
      expect.objectContaining({
        mimeType: expect.stringMatching(mimeType),
        fileType: expect.any(String),
        publicUrl: expect.any(String)
      })
    );

    const r2DownloadOptions = {
      timeout: 60 * 1000,

      // Do not throw errors for non-2xx responses, that makes handling them easier.
      validateStatus: null,
      responseType: 'arraybuffer' as ResponseType
    };

    let r2DownloadResponse;

    console.log('before R2 download', detailResponse.data?.playerInfo?.publicUrl);
    try {
      r2DownloadResponse = await axios.get(detailResponse.data?.playerInfo?.publicUrl, r2DownloadOptions);
    } catch (err: any) {
      console.error(err);
    }
    console.log('after R2 download', detailResponse.data?.playerInfo?.publicUrl);

    expect(r2DownloadResponse?.status).toEqual(200);

    const r2DownloadHash = createHash('sha256');
    r2DownloadHash.update(r2DownloadResponse?.data);

    const localFileHash = createHash('sha256');
    localFileHash.update(await readFile(filePath));

    expect(r2DownloadHash.digest('hex')).toEqual(localFileHash.digest('hex'));
  },
  TEST_TIMEOUT_UPLOAD
);
