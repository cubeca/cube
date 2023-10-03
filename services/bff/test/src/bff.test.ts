import axios from 'axios';
import jsonwebtoken from 'jsonwebtoken';
import * as settings from './settings';

const PROFILE_API_URL = `http://${settings.PROFILE_MICROSERVICE}:${settings.PROFILE_PORT}`;
const CONTENT_API_URL = `http://${settings.CONTENT_MICROSERVICE}:${settings.CONTENT_PORT}`;
const CLOUDFLARE_API_URL = `http://${settings.CLOUDFLARE_MICROSERVICE}:${settings.CLOUDFLARE_PORT}`;
const IDENTITY_API_URL = `http://${settings.IDENTITY_MICROSERVICE}:${settings.IDENTITY_PORT}`;
const BFF_MICROSERVICE = `http://${settings.BFF_MICROSERVICE}:${settings.BFF_PORT}`;
const UUID_REGEXP = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const NIL_UUID = '00000000-0000-0000-0000-000000000000';

const profileApi = axios.create({
  baseURL: PROFILE_API_URL,
  timeout: 10000,
  validateStatus: null
});

const contentApi = axios.create({
  baseURL: CONTENT_API_URL,
  timeout: 10000,
  validateStatus: null
});

const cloudflareApi = axios.create({
  baseURL: CLOUDFLARE_API_URL,
  timeout: 10000,
  validateStatus: null
});

const identityApi = axios.create({
  baseURL: IDENTITY_API_URL,
  timeout: 10000,
  validateStatus: null
});

const bffApi = axios.create({
  baseURL: BFF_MICROSERVICE,
  timeout: 10000,
  validateStatus: null
});

const getAuthReqOpts = (permissions: string[], uuid?: string) => {
  const jwt = jsonwebtoken.sign(
    {
      iss: 'CUBE',
      sub: uuid ? uuid : NIL_UUID,
      aud: permissions
    },
    settings.JWT_TOKEN_SECRET
  );

  return getReqOptsWithJwt(jwt);
};

const getReqOptsWithJwt = (jwt: string) => ({ headers: { Authorization: `Bearer ${jwt}` } });

/**
 * A test suite for testing the functionality of a profile API.
 */
describe('bff test suite', () => {
  /**
   * Test to check if the API is up and running by sending a GET request to the root endpoint ('/').
   * Expects to receive a status code of 200.
   */
  test('sanity test service up', async () => {
    const bffResp = await bffApi.get('/');
    expect(bffResp.status).toEqual(200);

    const cloudflareResp = await cloudflareApi.get('/');
    expect(cloudflareResp.status).toEqual(200);

    const identityResp = await identityApi.get('/');
    expect(identityResp.status).toEqual(200);

    const contentResp = await contentApi.get('/');
    expect(contentResp.status).toEqual(200);

    const profileResp = await profileApi.get('/');
    expect(profileResp.status).toEqual(200);
  }, 1000);
});
