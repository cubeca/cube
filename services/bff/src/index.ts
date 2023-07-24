import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { Server } from 'http';
import { AxiosHeaders } from 'axios';

import * as settings from './settings';
import { allowIfAnyOf } from './auth';
import { identityApi, profileApi, contentApi, cloudflareApi } from './microservices';
import { filterObject, transformContentListForProfile, getFiles } from './utils';

const app: Express = express();
app.use(cors());
app.use(express.json());

// BEWARE: For content related operations, do not forward `host` or `content-length` headers!
// - `host`: The service you are forwarding to will most likely not have the same `host` available in it's TLS certificate.
//   Axios will set an appropriate `host` header only if we let it. (I.e. we are not setting it ourselves.)
// - `content-length`: Express will have deserialized the request body for us already, and Axios will re-serialize it on forward.
//   This will inadvertendly lead to differences in `content-length`. Again, Axios will set an appropriate `content-length` header
//   only if we let it. (I.e. we are not setting it ourselves.)
const filterHeadersToForward = (req: Request, ...allowList: string[]): AxiosHeaders => {
  return new AxiosHeaders(filterObject(req.headers, ...allowList) as { [key: string]: string });
};

/////////////////// Cloudflare Service ///////////////////

app.post('/upload/video-tus-reservation', allowIfAnyOf('contentEditor'), async (req: Request, res: Response) => {
  // Typically, we receive an empty request body for this endpoint,
  // together with a (correct!) `content-length` header with value `0`.
  //
  // Express defaults to converting that into an empty JS object.
  //
  // When that happens, we can not forward the "content-length: 0" header anymore,
  // because the re-serialization of that is not a string with length 0 anymore.

  const { status, data, headers } = await cloudflareApi.post('upload/video-tus-reservation', '', {
    params: req.query,
    headers: filterHeadersToForward(req, 'upload-length', 'upload-metadata', 'authorization')
  });
  res.status(status).set(headers).send(data);
});

app.post('/upload/s3-presigned-url', allowIfAnyOf('contentEditor'), async (req: Request, res: Response) => {
  const { status, data } = await cloudflareApi.post('upload/s3-presigned-url', req.body, {
    headers: filterHeadersToForward(req, 'authorization')
  });
  res.status(status).json(data);
});

app.get('/files/:fileId', allowIfAnyOf('anonymous', 'active'), async (req: Request, res: Response) => {
  const reqHeaders = { ...req.headers };
  delete reqHeaders['host'];
  const { status, data } = await contentApi.get(`files/${req.params.fileId}`, {
    headers: filterHeadersToForward(req, 'authorization')
  });
  res.status(status).json(data);
});

/////////////////// Content Service ///////////////////

app.post('/content', allowIfAnyOf('contentEditor'), async (req: Request, res: Response) => {
  const { status, data } = await contentApi.post('content', req.body, {
    headers: filterHeadersToForward(req, 'authorization')
  });
  res.status(status).json(data);
});

app.get('/content', async (req: Request, res: Response) => {
  const { status, data } = await contentApi.get('content', {
    params: req.query,
    headers: filterHeadersToForward(req, 'authorization')
  });

  res.status(status).json(data);
});

app.get('/content/:contentId', async (req: Request, res: Response) => {
  const { status, data } = await contentApi.get('content/' + req.params.contentId);
  res.status(status).json(data);
});

/////////////////// Identity Service ///////////////////

app.post('/auth/user', allowIfAnyOf('anonymous', 'userAdmin'), async (req: Request, res: Response) => {
  const { status, data } = await identityApi.post('auth/user', req.body, {
    headers: filterHeadersToForward(req, 'authorization')
  });
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
  const { status, data } = await identityApi.put('auth/email', req.body, {
    headers: filterHeadersToForward(req, 'authorization')
  });
  res.status(status).json(data);
});

app.put('/auth/password', allowIfAnyOf('active'), async (req: Request, res: Response) => {
  const { status, data } = await identityApi.put('auth/password', req.body, {
    headers: filterHeadersToForward(req, 'authorization')
  });
  res.status(status).json(data);
});

app.post('/auth/resend-email-verification', async (req: Request, res: Response) => {
  const { status, data } = await identityApi.post('auth/resend-email-verification', req.body);
  res.status(status).json(data);
});

app.get('/auth/email/verify/:token', async (req: Request, res: Response) => {
  const { status, data } = await identityApi.get('auth/email/verify/' + req.params.token, req.body);
  res.status(status).json(data);
});

app.post('/auth/forgot-password', async (req: Request, res: Response) => {
  const { status, data } = await identityApi.post('auth/forgot-password', {
    params: req.query
  });

  res.status(status).json(data);
});

/////////////////// Profile Service ///////////////////

app.post('/profiles', async (req: Request, res: Response) => {
  const { status, data } = await profileApi.post('profiles', req.body);
  res.status(status).json(data);
});

app.get('/profiles/:profileId', async (req: Request, res: Response) => {
  const { status, data } = await profileApi.get('profiles/' + req.params.profileId, req.body);
  res.status(status).json(data);
});

app.patch('/profiles/:profileId', async (req: Request, res: Response) => {
  const { status, data } = await profileApi.patch('profiles/' + req.params.profileId, req.body);
  res.status(status).json(data);
});

app.get('/profiles/:id', async (req: Request, res: Response) => {
  try {
    const { id: profileId } = req.params;

    const profileResponse = await profileApi.get('profiles/' + profileId);
    if (profileResponse.status !== 200) {
      return res.status(profileResponse.status).json(profileResponse.data);
    }

    const { files } = await getFiles([
      profileResponse.data.heroFileId,
      profileResponse.data.logoFileId,
      profileResponse.data.descriptionAudioFileId
    ]);

    const profile = profileResponse.data;
    if (files[profile.heroFileId]) {
      profile.heroUrl = files[profile.heroFileId].playerInfo.publicUrl;
    }
    if (files[profile.logoFileId]) {
      profile.logoUrl = files[profile.logoFileId].playerInfo.publicUrl;
    }
    if (files[profile.descriptionAudioFileId]) {
      profile.descriptionAudioUrl = files[profile.descriptionAudioFileId].playerInfo.publicUrl;
    }

    const contentResponse = await contentApi.get('content', {
      params: {
        profileId,
        offset: 0,
        limit: 100
      }
    });
    if (contentResponse.status !== 200) {
      return res.status(contentResponse.status).json(contentResponse.data);
    }

    profile.content = await transformContentListForProfile(profile, contentResponse.data);
    res.status(200).json({ data: profile });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/', async (req: Request, res: Response) => {
  res.status(200).json('Service is running!');
});

const server: Server = app.listen(settings.PORT, async () => {
  console.log(`Listening on port ${settings.PORT}`);
});

export { app, server };
