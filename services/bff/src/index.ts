import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { Server } from 'http';
import { AxiosHeaders } from 'axios';

import * as settings from './settings';
import { allowIfAnyOf } from './auth';
import { identityApi, profileApi, contentApi, cloudflareApi } from './microservices';
import { inspect, filterObject } from './utils';

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

// TODO Make this an API endpoint in the cloudflare service
const getFiles = async (fileIds: string[]) => {
  const files: { [k: string]: any } = {};
  const errors: any[] = [];
  for (const fileId of fileIds.filter((x: any) => !!x)) {
    const { status, data } = await cloudflareApi.get(`files/${fileId}`);
    if (200 == status) {
      files[fileId] = data;
    } else {
      errors.push({ fileId, status, data });
    }
  }
  return { files, errors };
};

const transformContentListForProfile = async (profile: any, contentList: any[]) => {
  const fieldNames = {
    coverImageFileId: 'coverImageUrl',
    mediaFileId: 'mediaUrl',
    subtitlesFileId: 'subtitlesUrl',
    transcriptFileId: 'transcriptUrl'
  };

  const fileIds = [];
  for (const content of contentList) {
    for (const fileIdFieldName of Object.keys(fieldNames)) {
      if (content[fileIdFieldName]) {
        fileIds.push(content[fileIdFieldName]);
      }
    }
  }

  const { files, errors: fileErrors } = await getFiles(fileIds);
  if (fileErrors.length) {
    inspect(`in transformContentListForProfile(${profile.id}):`, { fileErrors });
  }

  for (const content of contentList) {
    for (const [fileIdFieldName, urlFieldName] of Object.entries(fieldNames)) {
      if (content[fileIdFieldName] && files[content[fileIdFieldName]]) {
        const file = files[content[fileIdFieldName]];

        // Videos have both, `dashUrl` or `hlsUrl`. TBD Which one works better for FE?
        const url = file.playerInfo.publicUrl ? file.playerInfo.publicUrl : file.playerInfo.dashUrl;

        content[urlFieldName] = url;
      }
    }

    content.creator = profile.organization;
    content.iconUrl = profile.logoUrl;

    // TODO Remove hack after migrating existing content to add `category` field.
    if (!content.category) {
      content.category = content.type;
    }
  }

  const contentByCategory: { [k: string]: any[] } = {};
  for (const content of contentList) {
    if (!contentByCategory[content.category]) {
      contentByCategory[content.category] = [];
    }
    contentByCategory[content.category].push(content);
  }

  return Object.entries(contentByCategory).map(([category, content]) => ({ category, content }));
};

app.get('/profiles/:id', async (req: Request, res: Response) => {
  const profileId = req.params.id;
  const { status, data: profile } = await profileApi.get('profiles/' + profileId);
  if (200 != status) {
    return res.status(status).json(profile);
  }

  const { files, errors: fileErrors } = await getFiles([
    profile?.heroFileId,
    profile?.logoFileId,
    profile?.descriptionAudioFileId
  ]);
  if (fileErrors.length) {
    console.log({ profile, fileErrors });
    // TODO prevent internal details from leaking through the error messages
    // return res.status(500).json(fileErrors);
  }

  if (files[profile?.heroFileId]) {
    profile.heroUrl = files[profile.heroFileId].playerInfo.publicUrl;
  }
  if (files[profile?.logoFileId]) {
    profile.logoUrl = files[profile.logoFileId].playerInfo.publicUrl;
  }
  if (files[profile?.descriptionAudioFileId]) {
    profile.descriptionAudioUrl = files[profile.descriptionAudioFileId].playerInfo.publicUrl;
  }

  const { status: contentStatus, data: content } = await contentApi.get('content', {
    params: {
      profileId,

      // TODO proper pagination on the profile page
      offset: 0,
      limit: 100
    }
  });
  if (200 != contentStatus) {
    return res.status(contentStatus).json(content);
  }

  profile.content = await transformContentListForProfile(profile, content.data);

  res.status(200).json({ data: profile });
});

app.get('/', async (req: Request, res: Response) => {
  res.status(200).json('Service is running!');
});

const server: Server = app.listen(settings.PORT, async () => {
  console.log(`Listening on port ${settings.PORT}`);
});

export { app, server };
