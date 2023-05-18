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

// BEWARE: Do not forward `host` or `content-length` headers!
// - `host`: The service you are forwarding to will most likely not have the same `host` available in it's TLS certificate.
//   Axios will set an appropriate `host` header only if we let it. (I.e. we are not setting it ourselves.)
// - `content-length`: Express will have deserialized the request body for us already, and Axios will re-serialize it on forward.
//   This will inadvertendly lead to differences in `content-length`. Again, Axios will set an appropriate `content-length` header
//   only if we let it. (I.e. we are not setting it ourselves.)
const filterHeadersToForward = (req: Request, ...allowList: string[]): AxiosHeaders => {
  return new AxiosHeaders(filterObject(req.headers, ...allowList) as { [key: string]: string });
}

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
    headers: filterHeadersToForward(req, 'upload-length', 'upload-metadata', 'authorization'),
  });
  res.status(status).set(headers).send(data);
});

app.post('/upload/s3-presigned-url', allowIfAnyOf('contentEditor'), async (req: Request, res: Response) => {
  const { status, data } = await cloudflareApi.post('upload/s3-presigned-url', req.body, { headers: filterHeadersToForward(req, 'authorization') });
  res.status(status).json(data);
});

app.get('/files/:fileId', allowIfAnyOf('anonymous', 'active'), async (req: Request, res: Response) => {
  const reqHeaders = { ...req.headers };
  delete reqHeaders['host'];
  const { status, data } = await contentApi.get(`files/${req.params.fileId}`, { headers: filterHeadersToForward(req, 'authorization') });
  res.status(status).json(data);
});

app.post('/content', allowIfAnyOf('contentEditor'), async (req: Request, res: Response) => {
  const { status, data } = await contentApi.post('content', req.body, { headers: filterHeadersToForward(req, 'authorization') });
  res.status(status).json(data);
});

app.get('/content', async (req: Request, res: Response) => {
  const {
    profileId,
    page,
    page_size,
    category,
    type,
    nation,
    creator
  } = req.query;

  // Temporarily (while working on profile page) respond with the same mock data as content microservice used to do.
  // TODO Transform data returned from content MS to the output format of this mock
  res.status(200).json({
    "data": [
      {
        "id": "1",
        "title": "Title 1",
        "creator": "Creator 1",
        "url": "/content/1",
        "thumbnailUrl": "images/video_thumbnail.jpg",
        "iconUrl": "images/creator_icon.png",
        "category": "video",
        "type": "video"
      },
      {
        "id": "2",
        "title": "Title 2",
        "creator": "Creator 2",
        "url": "/content/2",
        "thumbnailUrl": "images/video_thumbnail.jpg",
        "iconUrl": "images/creator_icon.png",
        "category": "video",
        "type": "video"
      }
    ]
  });

  // const { status, data } = await contentApi.get('content', {
  //   params: req.query,
  //   headers: filterHeadersToForward(req, 'authorization')
  // });
  // res.status(status).json(data);
});

app.get('/content/:contentId', async (req: Request, res: Response) => {
  // Temporarily (while working on profile page) respond with the same mock data as content microservice used to do.
  // TODO Transform data returned from content MS to the output format of this mock
  res.status(200).json({
    "data": {
      "id": req.params.contentId,
      "url": "/video.mp4",
      "title": `Video ${req.params.contentId}`,
      "createdDate": "07/01/2022",
      "updatedDate": "07/01/2022",
      "description": "Description of content Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dolor sem faucibus auctor quam pretium massa nulla cursus. Vel, a nisl ipsum, nisl. Mauris.",
      "descriptionUrl": "/description.mp3",
      "credits": "Dawn Powell, Camera Operator, Alissa Cat, Public Programs Magnus Ten, Editor",
      "contributors": [
        {
          "id": "1",
          "link": "/profile/1",
          "name": "Museum Of Anthropology",
          "socialUrl": "https: //www.twitter.com",
          "socialHandle": "@Moa",
          "logoUrl": "/images/moa.svg"
        },
        {
          "id": "2",
          "name": "Museum of Vancouver",
          "socialUrl": "https: //www.twitter.com",
          "socialHandle": "@Mov",
          "logoUrl": ""
        },
        {
          "id": "3",
          "name": "Dana Claxton"
        }
      ],
      "tags": [
        "tag 1",
        "tag 2"
      ]
    }
  });

  // const { status, data } = await contentApi.get('content/' + req.params.contentId);
  // res.status(status).json(data);
});

app.post('/auth/user', allowIfAnyOf('anonymous', 'userAdmin'), async (req: Request, res: Response) => {
  const { status, data } = await identityApi.post('auth/user', req.body, { headers: filterHeadersToForward(req, 'authorization') });
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
  const { status, data } = await identityApi.put('auth/email', req.body, { headers: filterHeadersToForward(req, 'authorization') });
  res.status(status).json(data);
});

app.put('/auth/password', allowIfAnyOf('active'), async (req: Request, res: Response) => {
  const { status, data } = await identityApi.put('auth/password', req.body, { headers: filterHeadersToForward(req, 'authorization') });
  res.status(status).json(data);
});

app.get('/auth/verify', allowIfAnyOf('unverified'), async (req: Request, res: Response) => {
  const { status, data } = await identityApi.get('auth/verify', {
    params: req.query,
    headers: filterHeadersToForward(req, 'authorization')
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

// TODO Make this an API endpoint in the cloudflare service
const getFiles = async (fileIds: string[]) => {
  const files: { [k: string]: any } = {};
  const errors: any[] = [];
  for (const fileId of fileIds.filter((x:any) => !!x)) {
    const { status, data } = await cloudflareApi.get(`files/${fileId}`);
    if (200 == status) {
      files[fileId] = data;
    } else {
      errors.push({ fileId, status, data });
    }
  }
  return { files, errors };
}

const transformContentListForProfile = async (profile:any, contentList:any[]) => {
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
}

app.get('/profiles/:id', async (req: Request, res: Response) => {
  const profileId = req.params.id;
  const { status, data: profile } = await profileApi.get('profiles/' + profileId);
  if (200 != status) {
    return res.status(status).json(profile);
  }

  const { files, errors: fileErrors } = await getFiles([profile?.heroFileId, profile?.logoFileId, profile?.descriptionAudioFileId]);
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
      limit: 100,
    }
  });
  if (200 != contentStatus) {
    return res.status(contentStatus).json(content);
  }

  profile.content = await transformContentListForProfile(profile, content.data);

  res.status(200).json({ data: profile });
});

app.get('/', async (req: Request, res: Response) => {
  res.status(200).json({});
});

const server: Server = app.listen(settings.PORT, async () => {
  console.log(`Listening on port ${settings.PORT}`);
});

export { app, server };
