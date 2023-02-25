import axios from 'axios';
import jsonwebtoken from 'jsonwebtoken';

import * as settings from './settings';

const API_URL = `http://${settings.MICROSERVICE}:${settings.PORT}`;

const UUID_REGEXP = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const NIL_UUID = '00000000-0000-0000-0000-000000000000';

const cloudflareApi = axios.create({
  baseURL: API_URL,
  timeout: 10000,

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
  const requestBody = {
    isPrivate: false,
    upload: {
      orgId: NIL_UUID,
      fileName: 'test.mp4',
      fileSizeBytes: 1000000,
      reserveDurationSeconds: 600,
      urlValidDurationSeconds: 5 * 60
    }
  };

  const { status, data } = await cloudflareApi.post(
    '/upload/video-tus-reservation',
    requestBody,
    getAuthReqOpts('contentEditor')
  );

  expect(status).toEqual(201);

  expect(data).toEqual(
    expect.objectContaining({
      fileId: expect.stringMatching(UUID_REGEXP),
      tusUploadUrl: expect.any(String)
    })
  );
});
