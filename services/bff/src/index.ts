import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { Server } from 'http';
import { AxiosHeaders } from 'axios';

import * as settings from './settings';
import { allowIfAnyOf } from './auth';
import { identityApi, profileApi, contentApi, cloudflareApi } from './microservices';
import { filterObject, getProfileData, transformContent } from './utils';

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
  const { status, data } = await cloudflareApi.get(`files/${req.params.fileId}`, {
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

app.get('/content', allowIfAnyOf('anonymous', 'active'), async (req: Request, res: Response) => {
  const { status, data } = await contentApi.get('content', {
    params: req.query,
    headers: filterHeadersToForward(req, 'authorization')
  });

  const transformedContent = await transformContent(data, filterHeadersToForward(req, 'authorization'));
  res.status(status).json(transformedContent);
});

app.get('/content/:contentId', allowIfAnyOf('anonymous', 'active'), async (req: Request, res: Response) => {
  const { status, data } = await contentApi.get('content/' + req.params.contentId, {
    params: req.query,
    headers: filterHeadersToForward(req, 'authorization')
  });

  const transformedContent = await transformContent([data], filterHeadersToForward(req, 'authorization'));
  res.status(status).json(transformedContent[0]);
});

app.delete('/content/:contentId', allowIfAnyOf('contentEditor'), async (req: Request, res: Response) => {
  const { status, data } = await contentApi.delete('content/' + req.params.contentId, {
    headers: filterHeadersToForward(req, 'authorization')
  });
  res.status(status).json(data);
});

/////////////////// Identity Service ///////////////////

app.post('/auth/user', allowIfAnyOf('anonymous'), async (req: Request, res: Response) => {
  const { status, data } = await identityApi.post('auth/user', req.body, {
    headers: filterHeadersToForward(req, 'authorization')
  });
  res.status(status).json(data);
});

app.post('/auth/login', allowIfAnyOf('anonymous'), async (req: Request, res: Response) => {
  const { status, data } = await identityApi.post('auth/login', req.body, {
    headers: filterHeadersToForward(req, 'authorization')
  });
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

app.put('/auth/password', allowIfAnyOf('active', 'password-reset'), async (req: Request, res: Response) => {
  const { status, data } = await identityApi.put('auth/password', req.body, {
    headers: filterHeadersToForward(req, 'authorization')
  });
  res.status(status).json(data);
});

app.post('/auth/resend-email-verification', allowIfAnyOf('anonymous'), async (req: Request, res: Response) => {
  const { status, data } = await identityApi.post('auth/resend-email-verification', req.body, {
    headers: filterHeadersToForward(req, 'authorization')
  });
  res.status(status).json(data);
});

app.get('/auth/email/verify/:token', async (req: Request, res: Response) => {
  const { status, data } = await identityApi.get('auth/email/verify/' + req.params.token, {
    headers: filterHeadersToForward(req, 'authorization')
  });
  if (status === 301) {
    res.redirect(data);
  } else {
    res.status(status).json(data);
  }
});

app.post('/auth/forgot-password', allowIfAnyOf('anonymous'), async (req: Request, res: Response) => {
  const { status, data } = await identityApi.post('auth/forgot-password', req.body, {
    headers: filterHeadersToForward(req, 'authorization')
  });
  res.status(status).json(data);
});

/////////////////// Profile Service ///////////////////

app.post('/profiles', allowIfAnyOf('anonymous', 'active'), async (req: Request, res: Response) => {
  const { status, data } = await profileApi.post('profiles', req.body, {
    headers: filterHeadersToForward(req, 'authorization')
  });
  res.status(status).json(data);
});

app.patch('/profiles/:profileId', allowIfAnyOf('active'), async (req: Request, res: Response) => {
  const { status, data } = await profileApi.patch('profiles/' + req.params.profileId, req.body, {
    headers: filterHeadersToForward(req, 'authorization')
  });
  res.status(status).json(data);
});

app.get('/profiles/:profileId', allowIfAnyOf('anonymous', 'active'), async (req: Request, res: Response) => {
  const { status, data } = await profileApi.get('profiles/' + req.params.profileId, {
    headers: filterHeadersToForward(req, 'authorization')
  });
  res.status(status).json(data);
});

app.get('/profiles/tag/:tag', allowIfAnyOf('anonymous', 'active'), async (req: Request, res: Response) => {
  const filteredAuthHeader = filterHeadersToForward(req, 'authorization');

  try {
    const { tag } = req.params;
    const tagResponse = await profileApi.get('profiles/tag/' + tag, {
      headers: filteredAuthHeader
    });

    if (tagResponse.status !== 200) {
      return res.status(tagResponse.status).json(tagResponse.data);
    }

    const profileId = tagResponse.data.id;
    const profile = await getProfileData(profileId, filteredAuthHeader);
    res.status(200).json({ data: profile });
  } catch (error) {
    res.status(500).json('Unable to retrieve profile details');
  }
});

app.get('/profiles/:profileId', allowIfAnyOf('anonymous', 'active'), async (req: Request, res: Response) => {
  const filteredAuthHeader = filterHeadersToForward(req, 'authorization');

  try {
    const { profileId } = req.params;
    const profile = await getProfileData(profileId, filteredAuthHeader);
    res.status(200).json({ data: profile });
  } catch (error) {
    res.status(500).json('Unable to retrieve profile details');
  }
});

app.get('/collaborators', allowIfAnyOf('anonymous', 'active'), async (req: Request, res: Response) => {
  const { status, data } = await profileApi.get('getProfilesByIdList/', {
    headers: filterHeadersToForward(req, 'authorization')
  });

  res.status(status).json(data);
});

app.get('/search', async (req: Request, res: Response) => {
  type ServiceResult = {
    status: number | null;
    data: any | null;
    error: string | null;
    meta: any;
  };

  const searchContentResult: ServiceResult = { status: null, data: null, error: null, meta: null };
  const searchProfileResult: ServiceResult = { status: null, data: null, error: null, meta: null };

  try {
    const contentResponse = await contentApi.get('search/', {
      params: req.query,
      headers: filterHeadersToForward(req, 'authorization')
    });

    searchContentResult.meta = contentResponse.data.meta;
    searchContentResult.status = contentResponse.status;
    searchContentResult.data = contentResponse.data.data;
  } catch (error: any) {
    searchContentResult.status = error.response?.status || 500;
    searchContentResult.error = error.message;
  }

  try {
    const profileResponse = await profileApi.get('search/', {
      params: req.query,
      headers: filterHeadersToForward(req, 'authorization')
    });

    searchProfileResult.meta = profileResponse.data.meta;
    searchProfileResult.status = profileResponse.status;
    searchProfileResult.data = profileResponse.data.data;
  } catch (error: any) {
    searchProfileResult.status = error.response?.status || 500;
    searchProfileResult.error = error.message;
  }

  res.status(200).json({
    contentResults: {
      meta: searchContentResult.meta,
      data: searchContentResult.data,
      status: searchContentResult.status,
      error: searchContentResult.error
    },
    profileResults: {
      meta: searchProfileResult.meta,
      data: searchProfileResult.data,
      status: searchProfileResult.status,
      error: searchProfileResult.error
    }
  });
});

app.get('/', async (req: Request, res: Response) => {
  res.status(200).json('Service is running!');
});

const server: Server = app.listen(settings.PORT, async () => {
  console.log(`Listening on port ${settings.PORT}`);
});

export { app, server };
