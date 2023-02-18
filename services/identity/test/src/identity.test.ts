import axios from "axios";
import * as jwt from 'jsonwebtoken';

import * as settings from './settings';

const API_URL = `http://${settings.MICROSERVICE}:${settings.PORT}`;

const UUID_REGEXP = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const NIL_UUID = '00000000-0000-0000-0000-000000000000';

const identityMicroservice = axios.create({
  baseURL: API_URL,
  timeout: 1000,

  // Do not throw errors for non-2xx responses, that makes testing easier.
  validateStatus: null,
});

let uniqueEmailCounter = 1;

const getUniqueEmail = () => `test-${uniqueEmailCounter++}@example.com`;

const getAuthReqOpts = (...permissions:string[]) => {
  const requestJwt = jwt.sign(
    {
      iss: 'CUBE',
      sub: NIL_UUID,
      aud: permissions
    },
    settings.JWT_TOKEN_SECRET
  );

  return {
    headers: {
      'Authorization': `Bearer ${requestJwt}`
    }
  };
}


test('gets anonymous JWT', async () => {
  const { status, data } = await identityMicroservice.post('/auth/anonymous', { anonymous: true });

  expect(status).toEqual(200);

  expect(data).toEqual(expect.objectContaining({
    jwt: expect.any(String),
  }));

  const jwtPayload = await jwt.verify(data.jwt, settings.JWT_TOKEN_SECRET);

  expect(jwtPayload).toEqual(expect.objectContaining({
    iss: 'CUBE',
    sub: NIL_UUID,
    aud: ['anonymous'],
    iat: expect.any(Number),
  }));
});

test('creates user, but no duplicate', async () => {
  const createUserRequestBody = {
    name: 'Real Name',
    email: getUniqueEmail(),
    password: 'super-secret',
    permissionIds: ['active'],
    hasAcceptedNewsletter: false,
    hasAcceptedTerms: false,
  };

  const { status, data } = await identityMicroservice.post('/auth/user', createUserRequestBody, getAuthReqOpts('userAdmin'));

  expect(status).toEqual(201);

  expect(data).toEqual(expect.objectContaining({
    id: expect.stringMatching(UUID_REGEXP),
  }));

  // Duplicate email should fail.
  const { status:statusDuplicate } = await identityMicroservice.post('/auth/user', createUserRequestBody, getAuthReqOpts('userAdmin'));
  expect(statusDuplicate).toEqual(400);
});

test('can not create user without correct permission', async () => {
  const createUserRequestJwt = jwt.sign(
    {
      iss: 'CUBE',
      sub: NIL_UUID,
      aud: ['wrongPermission']
    },
    settings.JWT_TOKEN_SECRET
  );

  const createUserRequestHeaders = {
    'Authorization': `Bearer ${createUserRequestJwt}`
  };

  const createUserRequestBody = {
    name: 'Real Name',
    email: getUniqueEmail(),
    password: 'super-secret',
    permissionIds: ['active'],
    hasAcceptedNewsletter: false,
    hasAcceptedTerms: false,
  };

  const { status, data } = await identityMicroservice.post('/auth/user', createUserRequestBody, { headers: createUserRequestHeaders });

  expect(status).toEqual(403);
});
