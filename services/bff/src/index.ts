import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { Server } from 'http';

import * as settings from './settings';
import { allowIfAnyOf } from './auth';
import { identityApi, profileApi, contentApi, cloudflareApi } from './microservices';

const app: Express = express();
app.use(cors());
app.use(express.json());

app.post('/upload/video-tus-reservation', allowIfAnyOf('contentEditor'), async (req: Request, res: Response) => {

  // Typically, we receive an empty request body for this endpoint,
  // together with a (correct!) `content-length` header with value `0`.
  //
  // Our default `express.json()` middleware converts that into an empty JS object.
  //
  // When that happens, we can not forward the "content-length: 0" header anymore,
  // because the serialization of that is not a string with length 0 anymore.
  //
  // TODO Find a way of *not* coercing an empty request body into an empty JS object.

  const reqHeaders = { ...req.headers };
  let reqBody = req.body;
  if (reqHeaders['content-length'] == '0') {

    // Let Axios set an appropriate `content-length` header.
    delete reqHeaders['content-length'];

    // Try to "reconstruct" the "original" empty request body.
    reqBody = '';
  }

  const { status, data, headers } = await cloudflareApi.post('upload/video-tus-reservation', reqBody, {
    params: req.query,
    headers: reqHeaders,
  });
  res.status(status).set(headers).send(data);
});

app.post('/upload/s3-presigned-url', allowIfAnyOf('contentEditor'), async (req: Request, res: Response) => {
  const { status, data } = await cloudflareApi.post('upload/s3-presigned-url', req.body, { headers: req.headers });
  res.status(status).json(data);
});

app.get('/files/:fileId', allowIfAnyOf('anonymous', 'active'), async (req: Request, res: Response) => {
  const { status, data } = await contentApi.get(`files/${req.params.fileId}`, { headers: req.headers });
  res.status(status).json(data);
});

app.post('/content', allowIfAnyOf('contentEditor'), async (req: Request, res: Response) => {
  const { status, data } = await contentApi.post('content', req.body, { headers: req.headers });
  res.status(status).json(data);
});

app.get('/content', async (req: Request, res: Response) => {
  const { status, data } = await contentApi.get('content', {
    params: req.query,
    headers: req.headers
  });
  res.status(status).json(data);
});

app.get('/content/:contentId', async (req: Request, res: Response) => {
  const { status, data } = await contentApi.get('content/' + req.params.contentId);
  res.status(status).json(data);
});

app.post('/auth/user', allowIfAnyOf('anonymous', 'userAdmin'), async (req: Request, res: Response) => {
  const { status, data } = await identityApi.post('auth/user', req.body, { headers: req.headers });
  res.status(status).json(data);
});

app.post('/auth/login', async (req: Request, res: Response) => {
  const { status, data } = await identityApi.post('auth/login', req.body);
  res.status(status).json(data);
});

app.post('/auth/anonymous', async (req: Request, res: Response) => {
  const { status, data } = await identityApi.post('auth/anonymous', req.body);
  res.status(status).json(data);
});

app.put('/auth/email', allowIfAnyOf('active'), async (req: Request, res: Response) => {
  const { status, data } = await identityApi.put('auth/email', req.body, { headers: req.headers });
  res.status(status).json(data);
});

app.put('/auth/password', allowIfAnyOf('active'), async (req: Request, res: Response) => {
  const { status, data } = await identityApi.put('auth/password', req.body, { headers: req.headers });
  res.status(status).json(data);
});

app.get('/auth/verify', allowIfAnyOf('unverified'), async (req: Request, res: Response) => {
  const { status, data } = await identityApi.get('auth/verify', {
    params: req.query,
    headers: req.headers
  });

  res.status(status).json(data);
});

app.get('/auth/forgot-password', async (req: Request, res: Response) => {
  const { status, data } = await identityApi.get('auth/forgot-password', {
    params: req.query
  });

  res.status(status).json(data);
});

app.post('/profiles', async (req: Request, res: Response) => {
  const { status, data } = await profileApi.post('profiles', req.body);
  res.status(status).json(data);
});

app.get('/profiles/:id', async (req: Request, res: Response) => {
  const { status, data } = await profileApi.get('profiles/' + req.params.id);
  res.status(status).json(data);
});

app.get('/', async (req: Request, res: Response) => {
  res.status(200).json({});
});

const server: Server = app.listen(settings.PORT, async () => {
  console.log(`Listening on port ${settings.PORT}`);
});

export { app, server };
