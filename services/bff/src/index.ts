import express, { Express, Request, Response } from 'express';
import cors from 'cors';

import * as settings from './settings';
import { allowIfAnyOf } from './auth';
import { identityApi, profileApi, contentApi, cloudflareApi } from './microservices';

const app: Express = express();
app.use(cors());
app.use(express.json());

app.post('/upload/video-tus-reservation', allowIfAnyOf('contentEditor'), async (req: Request, res: Response) => {
  const { status, data } = await cloudflareApi.post('/upload/video-tus-reservation', req.body, { headers: req.headers });
  res.status(status).json(data);
});

app.post('/upload/s3-presigned-url', allowIfAnyOf('contentEditor'), async (req: Request, res: Response) => {
  const { status, data } = await cloudflareApi.post('/upload/s3-presigned-url', req.body, { headers: req.headers });
  res.status(status).json(data);
});

app.post('/content', allowIfAnyOf('contentEditor'), async (req: Request, res: Response) => {
  const { status, data } = await contentApi.post('content/', req.body, { headers: req.headers });
  res.status(status).json(data);
});

app.get('/content', async (req: Request, res: Response) => {
  const { status, data } = await contentApi.get('content/');
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
  const { status, data } = await profileApi.post('profiles/', req.body);
  res.status(status).json(data);
});

app.get('/profiles/:id', async (req: Request, res: Response) => {
  const { status, data } = await profileApi.get('profiles/' + req.params.id);
  res.status(status).json(data);
});

app.listen(settings.PORT, async () => {
  console.log(`Listening on port ${settings.PORT}`);
});
