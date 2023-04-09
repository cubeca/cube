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

export interface CreateUserOptions  {
  userPermissions?: string[];
  createPermissions?: string[] | null;
}

const createUser = async ({ userPermissions = ['active'], createPermissions = ['userAdmin'] }: CreateUserOptions = {}) => {
  const requestBody = {
    name: 'Real Name',
    email: getUniqueEmail(),
    password: 'super-secret',
    permissionIds: userPermissions,
    hasAcceptedNewsletter: false,
    hasAcceptedTerms: false,
    organization: getUniqueOrganizationName(),
    website: getUniqueWebsite(),
    tag: getUniqueTag(),
  };
  const authReqOpts = (null === createPermissions) ? undefined : getAuthReqOpts(...createPermissions);
  const { status, data } = await identityApi.post('/auth/user', requestBody, authReqOpts);
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

test('signs up as "active,contentEditor" user', async () => {
  const { status, data, requestBody } = await createUser({ userPermissions: ['active', 'contentEditor'], createPermissions: null });
  if (201 != status) {
    console.log(data)
  }
  expect(status).toEqual(201);
  expect(data).toEqual(expect.objectContaining({
    id: expect.stringMatching(UUID_REGEXP),
  }));
});

test('can not sign up as user with excessive permissions', async () => {
  const { status, data, requestBody } = await createUser({ userPermissions: ['active', 'excessive'], createPermissions: null });
  if (403 != status) {
    console.log(data)
  }
  expect(status).toEqual(403);
});

test('"userAdmin" creates user with excessive permissions', async () => {
  const { status, data, requestBody } = await createUser({ userPermissions: ['active', 'excessive'], createPermissions: ['userAdmin'] });
  expect(status).toEqual(201);
  expect(data).toEqual(expect.objectContaining({
    id: expect.stringMatching(UUID_REGEXP),
  }));
});

test.skip('logs in, but only once', async () => {
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
    profileId: expect.stringMatching(UUID_REGEXP),
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

test('logs in without "anonymous" JWT', async () => {
  const { status:statusCreate, data:dataCreate, requestBody:requestBodyCreate } = await createUser();
  expect(statusCreate).toEqual(201);
  expect(dataCreate).toEqual(expect.objectContaining({
    id: expect.stringMatching(UUID_REGEXP),
  }));

  const requestBodyLogin = {
    username: requestBodyCreate.email,
    password: requestBodyCreate.password,
  };
  const { status:statusLogin, data:dataLogin } = await identityApi.post('/auth/login', requestBodyLogin);
  expect(statusLogin).toEqual(200);
  expect(dataLogin).toEqual(expect.objectContaining({
    jwt: expect.any(String),
    profileId: expect.stringMatching(UUID_REGEXP),
  }));

  const jwtPayload = await jsonwebtoken.verify(dataLogin.jwt, settings.JWT_TOKEN_SECRET);

  expect(jwtPayload).toEqual(expect.objectContaining({
    iss: 'CUBE',
    sub: dataCreate.id,
    aud: requestBodyCreate.permissionIds,
    iat: expect.any(Number),
  }));
});

test('updates email and logs in with new email', async () => {
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

  const requestBodyUpdateEmail = {
    uuid: dataCreate.id,
    email: getUniqueEmail(),
  };

  expect(requestBodyUpdateEmail.email).not.toEqual(requestBodyCreate.email);

  const { status:statusUpdateEmail, data:dataUpdateEmail } = await identityApi.put('/auth/email', requestBodyUpdateEmail, getReqOptsWithJwt(dataLogin.jwt));
  expect(statusUpdateEmail).toEqual(200);

  // Can log in with new email
  const requestBodyLoginWithNewEmail = {
    username: requestBodyUpdateEmail.email,
    password: requestBodyCreate.password,
  };
  const { status:statusLoginWithNewEmail, data:dataLoginWithNewEmail } = await identityApi.post('/auth/login', requestBodyLoginWithNewEmail, getAuthReqOpts('anonymous'));
  expect(statusLoginWithNewEmail).toEqual(200);
  expect(dataLoginWithNewEmail).toEqual(expect.objectContaining({
    jwt: expect.any(String),
  }));

  const jwtPayloadWithNewEmail = await jsonwebtoken.verify(dataLoginWithNewEmail.jwt, settings.JWT_TOKEN_SECRET);

  expect(jwtPayloadWithNewEmail).toEqual(expect.objectContaining({
    iss: 'CUBE',
    sub: dataCreate.id,
    aud: requestBodyCreate.permissionIds,
    iat: expect.any(Number),
  }));
});

test('updates password and logs in with new password', async () => {
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

  const requestBodyUpdatePassword = {
    uuid: dataCreate.id,
    password: `TOTALLY-DIFFERENT-${requestBodyCreate.password}-TOTALLY-DIFFERENT`,
  };

  expect(requestBodyUpdatePassword.password).not.toEqual(requestBodyCreate.password);

  const { status:statusUpdatePassword, data:dataUpdatePassword } = await identityApi.put('/auth/password', requestBodyUpdatePassword, getReqOptsWithJwt(dataLogin.jwt));
  expect(statusUpdatePassword).toEqual(200);

  // Can log in with new email
  const requestBodyLoginWithNewPassword = {
    username: requestBodyCreate.email,
    password: requestBodyUpdatePassword.password,
  };
  const { status:statusLoginWithNewPassword, data:dataLoginWithNewPassword } = await identityApi.post('/auth/login', requestBodyLoginWithNewPassword, getAuthReqOpts('anonymous'));
  expect(statusLoginWithNewPassword).toEqual(200);
  expect(dataLoginWithNewPassword).toEqual(expect.objectContaining({
    jwt: expect.any(String),
  }));

  const jwtPayloadWithNewPassword = await jsonwebtoken.verify(dataLoginWithNewPassword.jwt, settings.JWT_TOKEN_SECRET);

  expect(jwtPayloadWithNewPassword).toEqual(expect.objectContaining({
    iss: 'CUBE',
    sub: dataCreate.id,
    aud: requestBodyCreate.permissionIds,
    iat: expect.any(Number),
  }));
});

// TODO cover /auth/verify
// TODO cover /auth/forgot-password
// TODO test blocking of inactive users
