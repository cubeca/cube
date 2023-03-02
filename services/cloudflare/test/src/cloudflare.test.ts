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
import { inspect, inspectAxiosResponse, inspectAxiosError } from './utils';
import { uploadViaTus } from './tus';

const API_URL = `http://${settings.MICROSERVICE}:${settings.PORT}`;

const UUID_REGEXP = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const TIMESTAMP_REGEXP = /^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3,6}Z$/;

const NIL_UUID = '00000000-0000-0000-0000-000000000000';

const TEST_TIMEOUT_UPLOAD = 5 * 60 * 1000;

const cloudflareApi = axios.create({
  baseURL: API_URL,
  timeout: 60 * 1000,

  // Do not throw errors for non-2xx responses, that makes testing easier.
  validateStatus: null
});

const getAuthReqOpts = (...permissions: string[]) => {
  const jwt = jsonwebtoken.sign(
    {
      iss: 'CUBE',
      sub: NIL_UUID,
      aud: permissions
    },
    settings.JWT_TOKEN_SECRET
  );

  return getReqOptsWithJwt(jwt);
};

const getReqOptsWithJwt = (jwt: string) => ({ headers: { Authorization: `Bearer ${jwt}` } });

test('uploads video via TUS', async () => {

  // First, we have a long-running TUS upload.
  // Then we are waiting for a real video to get encoded over at Cloudflare.
  // Both things will take some real wall clock time.
  jest.useRealTimers();

  const meta = {
    profileId: NIL_UUID,
    allocVidTime: 31,
    validFor: 5 * 60
  };

  // See https://file-examples.com/
  // See /services/cloudflare/test/scripts/download_example_files.sh
  const filePath = `${__dirname}/../example-files/file_example_WEBM_480_900KB.webm`;

  const fileId = await uploadViaTus(`${API_URL}/upload/video-tus-reservation`, getAuthReqOpts('contentEditor').headers, filePath, meta);

  let detailStatus, detailData: any = {};
  for (let i = 0; i < 20; i++) {
    ({ status: detailStatus, data: detailData } = await cloudflareApi.get(
      `/files/${fileId}`,
      getAuthReqOpts('anonymous')
    ));

    if (200 === detailStatus) {
      break;
    }

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
      id: expect.stringMatching(UUID_REGEXP),
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
        videoIdOrSignedUrl: expect.any(String),
    })
  );

}, TEST_TIMEOUT_UPLOAD);

test('uploads non-video via S3 presigned URL', async () => {
  // See https://file-examples.com/
  // See /services/cloudflare/test/scripts/download_example_files.sh
  const filePath = `${__dirname}/../example-files/file_example_MP3_700KB.mp3`;
  const fileLength = 764176; // TODO read file size from disk
  const fileName = path.basename(filePath);
  const mimeType = mime.getType(filePath) || 'application/octet-stream'

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
  if (201 !== r2SignStatus) {
    inspectAxiosResponse(r2SignResponse);
  }

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

    // Do not throw errors for non-2xx responses, that makes handling them easier.
    validateStatus: null,

    headers: {
      'Content-Type': mimeType,
      'Content-Length': fileLength,
    }
  };

  const fileStream = fs.createReadStream(filePath);

  const r2UploadResponse = await axios.put(r2SignData.presignedUrl, fileStream, r2PutOptions);

  // inspect({
  //   status: r2UploadResponse.status,
  //   statusText: r2UploadResponse.statusText,
  //   headers: r2UploadResponse.headers,
  //   data: r2UploadResponse.data,
  // });

  expect(r2UploadResponse.status).toEqual(200);

  const detailResponse = await cloudflareApi.get(
    `/files/${fileId}`,
    getAuthReqOpts('anonymous')
  );

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
      publicUrl: expect.any(String),
    })
  );

  const r2DownloadOptions = {
    timeout: 60 * 1000,

    // Do not throw errors for non-2xx responses, that makes handling them easier.
    validateStatus: null,
    responseType: 'arraybuffer' as ResponseType
  };

  const r2DownloadResponse = await axios.get(detailResponse.data?.playerInfo?.publicUrl, r2DownloadOptions);

  expect(r2DownloadResponse.status).toEqual(200);

  // inspect({
  //   status: r2DownloadResponse.status,
  //   statusText: r2DownloadResponse.statusText,
  //   headers: r2DownloadResponse.headers,
  //   'typeof data': typeof r2DownloadResponse.data,
  // });

  const r2DownloadHash = createHash('sha256');
  r2DownloadHash.update(r2DownloadResponse.data);

  const localFileHash = createHash('sha256');
  localFileHash.update(await readFile(filePath));

  expect(r2DownloadHash.digest('hex')).toEqual(localFileHash.digest('hex'));

}, TEST_TIMEOUT_UPLOAD);
