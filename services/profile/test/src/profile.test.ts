import axios from 'axios';
import jsonwebtoken from 'jsonwebtoken';
import * as settings from './settings';

const PROFILE_API_URL = `http://${settings.PROFILE_MICROSERVICE}:${settings.PROFILE_PORT}`;
const IDENTITY_API_URL = `http://${settings.IDENTITY_MICROSERVICE}:${settings.IDENTITY_PORT}`;
const UUID_REGEXP = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const NIL_UUID = '00000000-0000-0000-0000-000000000000';

const profileApi = axios.create({
  baseURL: PROFILE_API_URL,
  timeout: 10000,
  validateStatus: null
});

const identityApi = axios.create({
  baseURL: IDENTITY_API_URL,
  timeout: 10000,
  validateStatus: null
});

let uniqueOrganizationNameCounter = 1;
const getUniqueOrganizationName = () => `org-${uniqueOrganizationNameCounter++}`;

let uniqueWebsiteCounter = 1;
const getUniqueWebsite = () => `https://org-${uniqueWebsiteCounter++}.example.com`;

let uniqueTagCounter = 1;
const getUniqueTag = () => `org-${uniqueTagCounter++}`;

const profileIdList: string[] = [];
const createProfile = async () => {
  const requestBody = {
    organization: getUniqueOrganizationName(),
    website: getUniqueWebsite(),
    tag: getUniqueTag()
  };

  const { status, data } = await profileApi.post('/profiles', requestBody, getAuthReqOpts(['anonymous']));

  profileIdList.push(data.id);
  return { status, data, requestBody };
};

const createProfileUser = async () => {
  const requestBody = {
    name: 'Real Name',
    email: 'email@cubecommons.ca',
    password: 'super-secret',
    hasAcceptedNewsletter: false,
    hasAcceptedTerms: false,
    organization: getUniqueOrganizationName(),
    website: getUniqueWebsite(),
    tag: getUniqueTag()
  };

  const { status, data } = await identityApi.post('/auth/user', requestBody, getAuthReqOpts(['anonymous']));
  return { status, data, requestBody };
};

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
describe('profile test suite', () => {
  // /**
  //  * Test to check if the API is up and running by sending a GET request to the root endpoint ('/').
  //  * Expects to receive a status code of 200.
  //  */
  // test('sanity test service up', async () => {
  //   const resp = await profileApi.get('/');
  //   expect(resp.status).toEqual(200);
  // }, 1000);

  // /**
  //  * Test to create a new profile and verify that no duplicate profiles can be created.
  //  * Expects to receive a status code of 201 and for the returned data object to contain an 'id' property that matches a UUID regular expression.
  //  */
  // test('creates profile, but no duplicate', async () => {
  //   const { status, data } = await createProfile();
  //   expect(status).toEqual(201);
  //   expect(data).toEqual(
  //     expect.objectContaining({
  //       id: expect.stringMatching(UUID_REGEXP)
  //     })
  //   );
  // });

  // /**
  //  * Test to attempt to create a duplicate profile and verify that it fails.
  //  * Expects to receive a status code of 400, indicating a duplicate profile cannot be created.
  //  */
  // test('checks duplicate profile creation fails', async () => {
  //   const { requestBody } = await createProfile();
  //   const { status: statusDuplicate } = await profileApi.post('/profiles', requestBody, getAuthReqOpts(['active']));
  //   expect(statusDuplicate).toEqual(400);
  // });

  /**
   * Test to attempt to create a profile with invalid data and verify that it fails.
   * Expects to receive a status code of 401.
   */
  // test('checks profile creation with invalid data', async () => {
  //   const requestBody = {
  //     organization: 'org',
  //     website: 'website'
  //   };
  //   const { status: statusBadProfile } = await profileApi.post('/profiles', requestBody, getAuthReqOpts(['anonymous']));
  //   expect(statusBadProfile).toEqual(401);
  // });

  /**
   * Test to create a profile and attempt to update it with an empty object.
   * Expects to receive a status code of 500, indicating a server error.
   */
  test('creates a profile and tries to update without permssion to do so', async () => {
    const { data } = await createProfile();
    console.log(data)
    const { status: statusUpdate } = await profileApi.patch(
      `/profiles/${data.id}`,
      { organization: 'bob' },
      getAuthReqOpts(['active'], NIL_UUID)
    );
    expect(statusUpdate).toEqual(403);
  });

  // /**
  //  * Test to create a profile and retrieve it by tag.
  //  * Expects to receive a status code of 200 in the response from a subsequent GET request.
  //  */
  // test('creates a profile and retrieves it using its tag', async () => {
  //   const { requestBody } = await createProfile();
  //   const getProfileResponse = await profileApi.get(`/profiles/tag/${requestBody.tag}`, getAuthReqOpts(['anonymous']));
  //   expect(getProfileResponse.status).toEqual(200);
  //   expect(getProfileResponse.data.tag).toEqual(requestBody.tag);
  // });

  // /**
  //  * Test to create a profile and attempt to update it with multiple attributes.
  //  * Expects to receive a status code of 200 and for the updated attributes to be reflected in the response from a subsequent GET request.
  //  */
  // test('creates a profile and tries to update with multiple attribute', async () => {
  //   const { status: createUserStatus, data, requestBody } = await createProfileUser();
  //   expect(createUserStatus).toEqual(201);

  //   const { status: loginStatus, data: userData } = await identityApi.post(
  //     '/auth/login',
  //     { email: requestBody.email, password: requestBody.password },
  //     getAuthReqOpts(['anonymous'])
  //   );
  //   expect(loginStatus).toEqual(200);

  //   const { status: statusUpdate } = await profileApi.patch(
  //     `/profiles/${userData.user.profile_id}`,
  //     {
  //       organization: 'bob',
  //       website: 'bobsnewsite',
  //       heroFileId: 'thisisanupdate',
  //       descriptionFileId: 'newurl',
  //       budget: '1ETH'
  //     },
  //     getAuthReqOpts(['active'], userData.user.uuid)
  //   );
  //   expect(statusUpdate).toEqual(200);

  //   const getProfileResponse = await profileApi.get(
  //     `/profiles/${userData.user.profile_id}`,
  //     getAuthReqOpts(['anonymous'])
  //   );
  //   expect(getProfileResponse.data.organization).toEqual('bob');
  //   expect(getProfileResponse.data.website).toEqual('bobsnewsite');
  //   expect(getProfileResponse.data.herofileid).toEqual('thisisanupdate');
  //   expect(getProfileResponse.data.descriptionfileid).toEqual('newurl');
  //   expect(getProfileResponse.data.budget).toEqual('1ETH');
  // });
});

/**
 * Runs after all the tests in the suite have completed. Deletes all the profiles that were created during the tests.
 * The IDs of the profiles are stored in the `profileIdList` variable.
 */
afterAll(async () => {
  for (const profileId in profileIdList) {
    // const { status } = await profileApi.delete(`/profiles/${profileIdList[profileId]}`, getAuthReqOpts(['userAdmin']));
    // expect(status).toEqual(200);
  }
});
