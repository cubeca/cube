import axios from 'axios';
import jsonwebtoken from 'jsonwebtoken';
import * as settings from './settings';

const API_URL = `http://${settings.MICROSERVICE}:${settings.PORT}`;
const UUID_REGEXP = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const NIL_UUID = '00000000-0000-0000-0000-000000000000';

const profileApi = axios.create({
  baseURL: API_URL,
  timeout: 10000,

  // Do not throw errors for non-2xx responses, that makes testing easier.
  validateStatus: null
});

let uniqueOrganizationNameCounter = 1;
const getUniqueOrganizationName = () => `org-${uniqueOrganizationNameCounter++}`;

let uniqueWebsiteCounter = 1;
const getUniqueWebsite = () => `https://org-${uniqueWebsiteCounter++}.example.com`;

let uniqueTagCounter = 1;
const getUniqueTag = () => `@org-${uniqueTagCounter++}`;

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

export interface CreateProfileOptions {
  createPermissions?: string[] | null;
}

const profileIdList: string[] = [];
const createProfile = async ({ createPermissions = ['userAdmin'] }: CreateProfileOptions = {}) => {
  const requestBody = {
    organization: getUniqueOrganizationName(),
    website: getUniqueWebsite(),
    tag: getUniqueTag()
  };

  const authReqOpts = null === createPermissions ? undefined : getAuthReqOpts(...createPermissions);
  const { status, data } = await profileApi.post('/profiles', requestBody, authReqOpts);

  profileIdList.push(data.id);
  return { status, data, requestBody };
};

/**
 * A test suite for testing the functionality of a profile API.
 */
describe('profile test suite', () => {
  /**
   * Test to check if the API is up and running by sending a GET request to the root endpoint ('/').
   * Expects to receive a status code of 200.
   */
  test('sanity test service up', async () => {
    const resp = await profileApi.get('/');
    expect(resp.status).toEqual(200);
  }, 1000);

  /**
   * Test to create a new profile and verify that no duplicate profiles can be created.
   * Expects to receive a status code of 201 and for the returned data object to contain an 'id' property that matches a UUID regular expression.
   */
  test('creates profile, but no duplicate', async () => {
    const { status, data } = await createProfile();
    expect(status).toEqual(201);
    expect(data).toEqual(
      expect.objectContaining({
        id: expect.stringMatching(UUID_REGEXP)
      })
    );
  });

  /**
   * Test to attempt to create a duplicate profile and verify that it fails.
   * Expects to receive a status code of 400, indicating a duplicate profile cannot be created.
   */
  test('checks duplicate profile creation fails', async () => {
    const { requestBody } = await createProfile();
    const { status: statusDuplicate } = await profileApi.post('/profiles', requestBody, getAuthReqOpts('userAdmin'));
    expect(statusDuplicate).toEqual(400);
  });

  /**
   * Test to attempt to create a profile with invalid data and verify that it fails.
   * Expects to receive a status code of 401.
   */
  test('checks profile creation with invalid data', async () => {
    const requestBody = {
      organization: 'org',
      website: 'website'
    };
    const { status: statusBadProfile } = await profileApi.post('/profiles', requestBody, getAuthReqOpts('userAdmin'));
    expect(statusBadProfile).toEqual(401);
  });

  /**
   * Test to create a profile and attempt to update it with an empty object.
   * Expects to receive a status code of 500, indicating a server error.
   */
  test('creates a profile and tries to update without data', async () => {
    const { data } = await createProfile();
    const { status: statusUpdate } = await profileApi.patch(`/profiles/${data.id}`, {}, getAuthReqOpts('userAdmin'));
    expect(statusUpdate).toEqual(500);
  });

  /**
   * Test to create a profile and attempt to update it with one attribute.
   * Expects to receive a status code of 200 and for the updated attribute to be reflected in the response from a subsequent GET request.
   */
  test('creates a profile and tries to update with one attribute', async () => {
    const { data } = await createProfile();
    const { status: statusUpdate } = await profileApi.patch(
      `/profiles/${data.id}?heroUrl=thisisanupdate`,
      {},
      getAuthReqOpts('userAdmin')
    );
    const getProfileResponse = await profileApi.get(`/profiles/${data.id}`, {});
    expect(statusUpdate).toEqual(200);
    expect(getProfileResponse.data.herourl).toEqual('thisisanupdate');
  });

  /**
   * Test to create a profile and attempt to update it with multiple attributes.
   * Expects to receive a status code of 200 and for the updated attributes to be reflected in the response from a subsequent GET request.
   */
  test('creates a profile and tries to update with multiple attribute', async () => {
    const { data } = await createProfile();
    const { status: statusUpdate } = await profileApi.patch(
      `/profiles/${data.id}?heroUrl=thisisanupdate&descriptionUrl=newurl&budget=1ETH`,
      {},
      getAuthReqOpts('userAdmin')
    );
    const getProfileResponse = await profileApi.get(`/profiles/${data.id}`, {});

    expect(statusUpdate).toEqual(200);
    expect(getProfileResponse.data.herourl).toEqual('thisisanupdate');
    expect(getProfileResponse.data.descriptionurl).toEqual('newurl');
    expect(getProfileResponse.data.budget).toEqual('1ETH')
  });
});

/**
 * Runs after all the tests in the suite have completed. Deletes all the profiles that were created during the tests.
 * The IDs of the profiles are stored in the `profileIdList` variable.
 */
afterAll(async () => {
  for (const profileId in profileIdList) {
    const { status } = await profileApi.delete(`/profiles/${profileIdList[profileId]}`, getAuthReqOpts('userAdmin'));
    expect(status).toEqual(200);
  }
});
