import express, { Express, Request, Response } from 'express';
import cors from 'cors';

import * as settings from './settings';
import { allowIfAnyOf } from './auth';
import { identityApi, profileApi, contentApi, cloudflareApi } from './microservices';

const app: Express = express();
app.use(cors());
app.use(express.json());

app.post('/upload/video-tus-reservation', allowIfAnyOf('contentEditor'), async (req: Request, res: Response) => {
  const upload = await cloudflareApi.post('/upload/video-tus-reservation', req.body);
  res.json(upload.data);
});

app.post('/upload/s3-presigned-url', allowIfAnyOf('contentEditor'), async (req: Request, res: Response) => {
  const upload = await cloudflareApi.post('/upload/s3-presigned-url', req.body);
  res.json(upload.data);
});

app.post('/content', allowIfAnyOf('contentEditor'), async (req: Request, res: Response) => {
  const id = await contentApi.get('content/', req.body);
  res.json(id.data);
});

app.get('/content', async (req: Request, res: Response) => {
  const content = await contentApi.get('content/');
  res.json(content.data);
});

app.get('/content/:contentId', async (req: Request, res: Response) => {
  const content = await contentApi.get('content/' + req.params.contentId);
  res.json(content.data);
});

app.post('/auth/user', allowIfAnyOf('anonymous', 'userAdmin'), async (req: Request, res: Response) => {
  const user = await identityApi.post('auth/user', req.body);
  res.json(user.data);
});

app.post('/auth/login', async (req: Request, res: Response) => {
  const login = await identityApi.post('auth/login', req.body);
  res.json(login.data);
});

app.post('/auth/anonymous', async (req: Request, res: Response) => {
  const anon = await identityApi.post('auth/anonymous', req.body);
  res.json(anon.data);
});

app.put('/auth/email', allowIfAnyOf('active'), async (req: Request, res: Response) => {
  const email = await identityApi.put('auth/email', req.body);
  res.json(email.data);
});

app.put('/auth/password', allowIfAnyOf('active'), async (req: Request, res: Response) => {
  const password = await identityApi.put('auth/password', req.body);
  res.json(password.data);
});

app.get('/auth/verify', allowIfAnyOf('unverified'), async (req: Request, res: Response) => {
  const verify = await identityApi.get('auth/verify', {
    params: req.query
  });

  res.json(verify.data);
});

app.get('/auth/forgot-password', async (req: Request, res: Response) => {
  const forgotPassword = await identityApi.get('auth/forgot-password', {
    params: req.query
  });

  res.json(forgotPassword.status);
});

app.post('/profiles', async (req: Request, res: Response) => {
  const id = await profileApi.post('profiles/', req.body);
  res.json(id.data);
});

app.get('/profiles/:id', async (req: Request, res: Response) => {
  const profile = await profileApi.get('profiles/' + req.params.id);
  res.json(profile.data);
});

app.listen(settings.PORT, async () => {
  console.log(`Listening on port ${settings.PORT}`);
});
