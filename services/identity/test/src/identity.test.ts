import axios from "axios";
import jsonwebtoken from 'jsonwebtoken';

import * as settings from './settings';

const API_URL = `http://${settings.MICROSERVICE}:${settings.PORT}`;

const UUID_REGEXP = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const NIL_UUID = '00000000-0000-0000-0000-000000000000';

const identityApi = axios.create({
  baseURL: API_URL,
  timeout: 1000,

  // Do not throw errors for non-2xx responses, that makes testing easier.
  validateStatus: null,
});

let uniqueEmailCounter = 1;

const getUniqueEmail = () => `test-${uniqueEmailCounter++}@example.com`;

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

const createUser = async ({ userPermissions = ['active'], createPermissions = ['userAdmin'] } = {}) => {
  const requestBody = {
    name: 'Real Name',
    email: getUniqueEmail(),
    password: 'super-secret',
    permissionIds: userPermissions,
    hasAcceptedNewsletter: false,
    hasAcceptedTerms: false,
  };
  const { status, data } = await identityApi.post('/auth/user', requestBody, getAuthReqOpts(...createPermissions));
  return { status, data, requestBody };
};

test('gets anonymous JWT', async () => {
  const { status, data } = await identityApi.post('/auth/anonymous', { anonymous: true });

  expect(status).toEqual(200);

  expect(data).toEqual(expect.objectContaining({
    jwt: expect.any(String),
  }));

  const jwtPayload = await jsonwebtoken.verify(data.jwt, settings.JWT_TOKEN_SECRET);

  expect(jwtPayload).toEqual(expect.objectContaining({
    iss: 'CUBE',
    sub: NIL_UUID,
    aud: ['anonymous'],
    iat: expect.any(Number),
  }));
});

test('creates user, but no duplicate', async () => {
  const { status, data, requestBody } = await createUser();

  expect(status).toEqual(201);

  expect(data).toEqual(expect.objectContaining({
    id: expect.stringMatching(UUID_REGEXP),
  }));

  // Duplicate email should fail.
  const { status:statusDuplicate } = await identityApi.post('/auth/user', requestBody, getAuthReqOpts('userAdmin'));
  expect(statusDuplicate).toEqual(400);
});

test('can not create user without correct permission', async () => {
  const { status, data, requestBody } = await createUser({ createPermissions: ['wrongPermission'] });
  expect(status).toEqual(403);
});

test('logs in', async () => {
  const { status:statusCreate, data:dataCreate, requestBody:requestBodyCreate } = await createUser();
  expect(statusCreate).toEqual(201);
  expect(dataCreate).toEqual(expect.objectContaining({
    id: expect.stringMatching(UUID_REGEXP),
  }));

  const requestBodyLogin = {
    username: requestBodyCreate.email,
    password: requestBodyCreate.password,
  };
  const { status:statusLogin, data:dataLogin } = await identityApi.post('/auth/login', requestBodyLogin, getAuthReqOpts('anonymous'));
  expect(statusLogin).toEqual(200);
  expect(dataLogin).toEqual(expect.objectContaining({
    jwt: expect.any(String),
  }));

  const jwtPayload = await jsonwebtoken.verify(dataLogin.jwt, settings.JWT_TOKEN_SECRET);

  expect(jwtPayload).toEqual(expect.objectContaining({
    iss: 'CUBE',
    sub: dataCreate.id,
    aud: requestBodyCreate.permissionIds,
    iat: expect.any(Number),
  }));

  // Can *NOT* log in a second time
  const { status:statusRepeatLogin, data:dataRepeatLogin } = await identityApi.post('/auth/login', requestBodyLogin, getReqOptsWithJwt(dataLogin.jwt));
  expect(statusRepeatLogin).toEqual(403);
});
