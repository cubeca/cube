import axios from "axios";
import jsonwebtoken from 'jsonwebtoken';

import * as settings from './settings';

const API_URL = `http://${settings.MICROSERVICE}:${settings.PORT}`;

const UUID_REGEXP = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const NIL_UUID = '00000000-0000-0000-0000-000000000000';

const profileApi = axios.create({
  baseURL: API_URL,
  timeout: 1000,

  // Do not throw errors for non-2xx responses, that makes testing easier.
  validateStatus: null,
});

let uniqueOrganizationNameCounter = 1;
const getUniqueOrganizationName = () => `org-${uniqueOrganizationNameCounter++}`;

let uniqueWebsiteCounter = 1;
const getUniqueWebsite = () => `https://org-${uniqueWebsiteCounter++}.example.com`;

let uniqueTagCounter = 1;
const getUniqueTag = () => `@org-${uniqueTagCounter++}`;

const getAuthReqOpts = (...permissions:string[]) => {
  const jwt = jsonwebtoken.sign(
    {
      iss: 'CUBE',
      sub: NIL_UUID,
      aud: permissions
    },
    settings.JWT_TOKEN_SECRET
  );

  return getReqOptsWithJwt(jwt);
}

const getReqOptsWithJwt = (jwt:string) => ({ headers: { Authorization: `Bearer ${jwt}` }});

export interface CreateProfileOptions  {
  createPermissions?: string[] | null;
}

const createProfile = async ({ createPermissions = ['userAdmin'] }: CreateProfileOptions = {}) => {
  const requestBody = {
    organization: getUniqueOrganizationName(),
    website: getUniqueWebsite(),
    tag: getUniqueTag()
  };
  const authReqOpts = (null === createPermissions) ? undefined : getAuthReqOpts(...createPermissions);
  const { status, data } = await profileApi.post('/profiles', requestBody, authReqOpts);
  return { status, data, requestBody };
};

test('creates profile, but no duplicate', async () => {
  const { status, data, requestBody } = await createProfile({ createPermissions: null });

  expect(status).toEqual(201);

  expect(data).toEqual(expect.objectContaining({
    id: expect.stringMatching(UUID_REGEXP),
  }));

  // Duplicate email should fail.
  const { status: statusDuplicate } = await profileApi.post('/profiles', requestBody, getAuthReqOpts('userAdmin'));
  expect(statusDuplicate).toEqual(400);

  const profileId = data.id;

  const { status: retrieveStatus, data: retrieveData } = await profileApi.get(`/profiles/${profileId}`);
  expect(retrieveStatus).toEqual(200);
  expect(retrieveData).toMatchObject(
    expect.objectContaining({
      id: profileId,
      ...requestBody
    })
  );
});
