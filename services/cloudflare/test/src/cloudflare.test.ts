import { setTimeout } from 'node:timers/promises';

import axios from 'axios';
import jsonwebtoken from 'jsonwebtoken';

import * as settings from './settings';
import { inspect, inspectAxiosResponse, inspectAxiosError } from './utils';
import { uploadViaTus } from './tus';

const API_URL = `http://${settings.MICROSERVICE}:${settings.PORT}`;

const UUID_REGEXP = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const TIMESTAMP_REGEXP = /^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3,6}Z$/;

const NIL_UUID = '00000000-0000-0000-0000-000000000000';

const TEST_TIMEOUT_TUS = 5 * 60 * 1000;

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

test('gets video TUS upload URL', async () => {
  const meta = {
    profileId: NIL_UUID,
    allocVidTime: 31,
    validFor: 5 * 60
  };

  // See https://file-examples.com/
  // See /services/cloudflare/test/scripts/download_example_files.sh
  const filePath = `${__dirname}/../example-files/file_example_WEBM_480_900KB.webm`;

  const fileId = await uploadViaTus(`${API_URL}/upload/video-tus-reservation`, getAuthReqOpts('contentEditor').headers, filePath, meta);

  // We are waiting for a real video to get encoded over at Cloudflare.
  // That will take some real wall clock time.
  jest.useRealTimers();

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

}, TEST_TIMEOUT_TUS);

test.skip('gets S3 presigned URL', async () => {
  const requestBody = {
    profileId: NIL_UUID,
    upload: {
      fileName: 'test.pdf',
      fileSizeBytes: 1000000,
      urlValidDurationSeconds: 5 * 60
    }
  };

  const r2Response = await cloudflareApi.post(
    '/upload/s3-presigned-url',
    requestBody,
    getAuthReqOpts('contentEditor')
  );
  const { status, data } = r2Response;
  if (201 !== status) {
    inspectAxiosResponse(r2Response);
  }

  expect(status).toEqual(201);

  expect(data).toEqual(
    expect.objectContaining({
      fileId: expect.stringMatching(UUID_REGEXP),
      presignedUrl: expect.any(String)
    })
  );
});
