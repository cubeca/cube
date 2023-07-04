import axios from 'axios';
import jsonwebtoken from 'jsonwebtoken';
import * as settings from './settings';
import * as db from '../../src/db/queries';

const API_URL = `http://${settings.MICROSERVICE}:${settings.PORT}`;
const UUID_REGEXP = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const NIL_UUID = '00000000-0000-0000-0000-000000000000';

const identityApi = axios.create({
  baseURL: API_URL,
  timeout: 60 * 10000,

  // Do not throw errors for non-2xx responses, that makes testing easier.
  validateStatus: null
});

let uniqueEmailCounter = 1;
const getUniqueEmail = () => `test-${uniqueEmailCounter++}@example.com`;

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

const createProfileUser = async () => {
  const requestBody = {
    name: 'Real Name',
    email: getUniqueEmail(),
    password: 'super-secret',
    hasAcceptedNewsletter: false,
    hasAcceptedTerms: false,
    organization: getUniqueOrganizationName(),
    website: getUniqueWebsite(),
    tag: getUniqueTag()
  };

  const { status, data } = await identityApi.post('/auth/user', requestBody);
  return { status, data, requestBody };
};

const createRegularUser = async () => {
  const requestBody = {
    name: 'Real Name',
    email: getUniqueEmail(),
    password: 'super-secret',
    hasAcceptedNewsletter: true,
    hasAcceptedTerms: true
  };

  const { status, data } = await identityApi.post('/auth/user', requestBody);
  return { status, data, requestBody };
};

test('sanity test service up', async () => {
  const resp = await identityApi.get('/');
  expect(resp.status).toEqual(200);
});

test('gets anonymous JWT', async () => {
  const { status, data } = await identityApi.post('/auth/anonymous', { anonymous: true });
  expect(status).toEqual(200);
  expect(data).toEqual(
    expect.objectContaining({
      jwt: expect.any(String)
    })
  );

  const jwtPayload = await jsonwebtoken.verify(data.jwt, settings.JWT_TOKEN_SECRET);

  expect(jwtPayload).toEqual(
    expect.objectContaining({
      iss: 'CUBE',
      sub: NIL_UUID,
      aud: ['anonymous'],
      iat: expect.any(Number)
    })
  );
});

test('creates user, but no profile duplicates', async () => {
  const { status, data, requestBody } = await createProfileUser();
  expect(status).toEqual(201);

  expect(data).toEqual(
    expect.objectContaining({
      id: expect.stringMatching(UUID_REGEXP)
    })
  );

  // Duplicate profile should fail.
  const { status: statusDuplicate } = await identityApi.post('/auth/user', requestBody);
  expect(statusDuplicate).toEqual(400);
});

test('creates user, but no email duplicates', async () => {
  const { status, data, requestBody } = await createRegularUser();
  expect(status).toEqual(201);

  expect(data).toEqual(
    expect.objectContaining({
      id: expect.stringMatching(UUID_REGEXP)
    })
  );

  // Duplicate email should fail.
  const { status: statusDuplicate } = await identityApi.post('/auth/user', requestBody);
  expect(statusDuplicate).toEqual(400);
});

test('If the user isnt active or verified, block login', async () => {
  const { status: statusCreate, data: dataCreate, requestBody: requestBodyCreate } = await createRegularUser();
  expect(statusCreate).toEqual(201);
  expect(dataCreate).toEqual(
    expect.objectContaining({
      id: expect.stringMatching(UUID_REGEXP)
    })
  );

  const requestBodyLogin = {
    email: requestBodyCreate.email,
    password: requestBodyCreate.password
  };

  const { status: statusLogin } = await identityApi.post('/auth/login', requestBodyLogin);
  expect(statusLogin).toEqual(403);
});

test('logs in without "anonymous" JWT', async () => {
  const { status: statusCreate, data: dataCreate, requestBody: requestBodyCreate } = await createRegularUser();
  expect(statusCreate).toEqual(201);
  expect(dataCreate).toEqual(
    expect.objectContaining({
      id: expect.stringMatching(UUID_REGEXP)
    })
  );

  const requestBodyLogin = {
    email: requestBodyCreate.email,
    password: requestBodyCreate.password
  };

  await db.addPermissionIds(dataCreate.id, ['active']);
  await db.updateActiveStatus(dataCreate.id, true);
  await db.updateEmailVerification(dataCreate.id, true);

  const { status: statusLogin, data: dataLogin } = await identityApi.post('/auth/login', requestBodyLogin);
  expect(statusLogin).toEqual(200);
  expect(dataLogin).toEqual(
    expect.objectContaining({
      jwt: expect.any(String),
      user: expect.any(Object)
    })
  );

  const jwtPayload = await jsonwebtoken.verify(dataLogin.jwt, settings.JWT_TOKEN_SECRET);
  expect(jwtPayload).toEqual(
    expect.objectContaining({
      iss: 'CUBE',
      sub: dataCreate.id,
      aud: ['active'],
      iat: expect.any(Number)
    })
  );
});

test('logs in with invalid pw', async () => {
  const { status: statusCreate, data: dataCreate, requestBody: requestBodyCreate } = await createRegularUser();
  expect(statusCreate).toEqual(201);
  expect(dataCreate).toEqual(
    expect.objectContaining({
      id: expect.stringMatching(UUID_REGEXP)
    })
  );

  const requestBodyLogin = {
    email: requestBodyCreate.email,
    password: 'wrongwrong'
  };

  await db.addPermissionIds(dataCreate.id, ['active']);
  await db.updateActiveStatus(dataCreate.id, true);
  await db.updateEmailVerification(dataCreate.id, true);

  const { status: statusLogin } = await identityApi.post('/auth/login', requestBodyLogin);
  expect(statusLogin).toEqual(403);
});

test('updates email and logs in with new email', async () => {
  const { status: statusCreate, data: dataCreate, requestBody: requestBodyCreate } = await createRegularUser();
  expect(statusCreate).toEqual(201);
  expect(dataCreate).toEqual(
    expect.objectContaining({
      id: expect.stringMatching(UUID_REGEXP)
    })
  );

  await db.addPermissionIds(dataCreate.id, ['active']);
  await db.updateActiveStatus(dataCreate.id, true);
  await db.updateEmailVerification(dataCreate.id, true);

  const requestBodyLogin = {
    email: requestBodyCreate.email,
    password: requestBodyCreate.password
  };

  const { status: statusLogin, data: dataLogin } = await identityApi.post('/auth/login', requestBodyLogin);
  expect(statusLogin).toEqual(200);
  expect(dataLogin).toEqual(
    expect.objectContaining({
      jwt: expect.any(String)
    })
  );

  const jwtPayload = await jsonwebtoken.verify(dataLogin.jwt, settings.JWT_TOKEN_SECRET);
  expect(jwtPayload).toEqual(
    expect.objectContaining({
      iss: 'CUBE',
      sub: dataCreate.id,
      aud: ['active'],
      iat: expect.any(Number)
    })
  );

  const requestBodyUpdateEmail = {
    uuid: dataCreate.id,
    email: getUniqueEmail(),
    token: dataLogin.jwt
  };

  expect(requestBodyUpdateEmail.email).not.toEqual(requestBodyCreate.email);
  const { status: statusUpdateEmail, data: dataUpdateEmail } = await identityApi.put(
    '/auth/email',
    requestBodyUpdateEmail,
    getAuthReqOpts('active')
  );

  expect(statusUpdateEmail).toEqual(200);
  await db.updateActiveStatus(dataCreate.id, true);
  await db.updateEmailVerification(dataCreate.id, true);

  // Can log in with new email
  const requestBodyLoginWithNewEmail = {
    email: requestBodyUpdateEmail.email,
    password: requestBodyCreate.password
  };

  const { status: statusLoginWithNewEmail, data: dataLoginWithNewEmail } = await identityApi.post(
    '/auth/login',
    requestBodyLoginWithNewEmail
  );

  expect(statusLoginWithNewEmail).toEqual(200);
  expect(dataLoginWithNewEmail).toEqual(
    expect.objectContaining({
      jwt: expect.any(String)
    })
  );

  const jwtPayloadWithNewEmail = await jsonwebtoken.verify(dataLoginWithNewEmail.jwt, settings.JWT_TOKEN_SECRET);
  expect(jwtPayloadWithNewEmail).toEqual(
    expect.objectContaining({
      iss: 'CUBE',
      sub: dataCreate.id,
      aud: ['active'],
      iat: expect.any(Number)
    })
  );
});

test('try to maliciously change another users email', async () => {
  const { status: statusCreate, data: dataCreate, requestBody: requestBodyCreate } = await createRegularUser();
  expect(statusCreate).toEqual(201);

  await db.addPermissionIds(dataCreate.id, ['active']);
  await db.updateActiveStatus(dataCreate.id, true);

  const jwt = jsonwebtoken.sign(
    {
      iss: 'CUBE',
      sub: '00000000-0000-0000-0000-000000000000',
      aud: ['active']
    },
    settings.JWT_TOKEN_SECRET
  );

  const requestBodyUpdateEmail = {
    uuid: dataCreate.id,
    email: getUniqueEmail(),
    token: jwt
  };

  const { status: statusUpdateEmail } = await identityApi.put(
    '/auth/email',
    requestBodyUpdateEmail,
    getAuthReqOpts('active')
  );

  expect(statusUpdateEmail).toEqual(401);
});

test('updates password and logs in with new password', async () => {
  const { status: statusCreate, data: dataCreate, requestBody: requestBodyCreate } = await createRegularUser();
  expect(statusCreate).toEqual(201);
  expect(dataCreate).toEqual(
    expect.objectContaining({
      id: expect.stringMatching(UUID_REGEXP)
    })
  );

  const requestBodyLogin = {
    email: requestBodyCreate.email,
    password: requestBodyCreate.password
  };

  await db.addPermissionIds(dataCreate.id, ['active']);
  await db.updateActiveStatus(dataCreate.id, true);
  await db.updateEmailVerification(dataCreate.id, true);

  const { status: statusLogin, data: dataLogin } = await identityApi.post('/auth/login', requestBodyLogin);

  expect(statusLogin).toEqual(200);
  expect(dataLogin).toEqual(
    expect.objectContaining({
      jwt: expect.any(String)
    })
  );

  const jwtPayload = await jsonwebtoken.verify(dataLogin.jwt, settings.JWT_TOKEN_SECRET);
  expect(jwtPayload).toEqual(
    expect.objectContaining({
      iss: 'CUBE',
      sub: dataCreate.id,
      aud: ['active'],
      iat: expect.any(Number)
    })
  );

  const requestBodyUpdatePassword = {
    uuid: dataCreate.id,
    currentPassword: 'super-secret',
    newPassword: `TOTALLY-DIFFERENT-${requestBodyCreate.password}-TOTALLY-DIFFERENT`,
    token: dataLogin.jwt
  };

  expect(requestBodyUpdatePassword.newPassword).not.toEqual(requestBodyCreate.password);
  const { status: statusUpdatePassword } = await identityApi.put('/auth/password', requestBodyUpdatePassword);
  expect(statusUpdatePassword).toEqual(200);

  // Can log in with new pw
  const requestBodyLoginWithNewPassword = {
    email: requestBodyCreate.email,
    password: requestBodyUpdatePassword.newPassword
  };

  const { status: statusLoginWithNewPassword, data: dataLoginWithNewPassword } = await identityApi.post(
    '/auth/login',
    requestBodyLoginWithNewPassword
  );

  expect(statusLoginWithNewPassword).toEqual(200);
  expect(dataLoginWithNewPassword).toEqual(
    expect.objectContaining({
      jwt: expect.any(String)
    })
  );

  const jwtPayloadWithNewPassword = await jsonwebtoken.verify(dataLoginWithNewPassword.jwt, settings.JWT_TOKEN_SECRET);
  expect(jwtPayloadWithNewPassword).toEqual(
    expect.objectContaining({
      iss: 'CUBE',
      sub: dataCreate.id,
      aud: ['active'],
      iat: expect.any(Number)
    })
  );
});

test('test email verification', async () => {
  const { status: statusCreate, data: dataCreate } = await createRegularUser();
  expect(statusCreate).toEqual(201);
  expect(dataCreate).toEqual(
    expect.objectContaining({
      id: expect.stringMatching(UUID_REGEXP)
    })
  );

  try {
    await identityApi.get(`/auth/email/verify/${dataCreate.jwt}`, {});
  } catch (e: any) {
    expect(e.request._isRedirect).toEqual(true);
  }
});
