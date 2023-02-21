import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import axios from 'axios';

import * as db from './db/queries';
import * as settings from './settings';
import { allowIfAnyOf, extractUser } from './auth';
import { makeCloudflareTusUploadMetadata } from './utils';

export const CLOUDFLARE_API_STREAM = `https://api.cloudflare.com/client/v4/accounts/${settings.CLOUDFLARE_ACCOUNT_ID}/stream?direct_user=true`;

const app = express();

app.use(cors());
app.use(express.json());

export interface Headers { [k: string]: string };

app.post('/upload/video-tus-reservation', allowIfAnyOf('contentEditor'), async (req: Request, res: Response) => {
  const {
    isPrivate = false,
    upload: {
      orgId,
      fileName,
      fileSizeBytes,
      reserveDurationSeconds,
      urlValidDurationSeconds = 30 * 60
    }
  } = req.body;


  if (!fileSizeBytes) {
    return res.status(400).send(`Invalid Request. 'upload.fileSizeBytes' required`);
  }

  if (!reserveDurationSeconds) {
    return res.status(400).send(`Invalid Request. 'reserveDurationSeconds' required`);
  }

  try {
    const { id:userId } = extractUser(req);

    const dbFileStub = await db.insertVideoFileStub({
      isPrivate,
      upload: {
        userId,
        orgId,
        fileName,
        fileSizeBytes,
        reserveDurationSeconds,
        urlValidDurationSeconds
      }
    });

    const fileId = dbFileStub.id;

    const headers:Headers = {
      Authorization: `bearer ${settings.CLOUDFLARE_API_TOKEN}`,
      'Tus-Resumable': '1.0.0',
      'Upload-Creator': `file:${fileId}`,
      'Upload-Length': String(fileSizeBytes),
      'Upload-Metadata': makeCloudflareTusUploadMetadata({
        reserveDurationSeconds,
        isPrivate,
        urlValidDurationSeconds,
        uploadingUserId:userId
      })
    };

    const cfResponse = await axios.post(CLOUDFLARE_API_STREAM, null, { headers });

    const tusUploadUrl = cfResponse.headers['location'];
    const cloudflareStreamUid = cfResponse.headers['stream-media-id'];

    if (!tusUploadUrl || !cloudflareStreamUid) {
      return res.status(500).send('Error retrieving content upload url');
    }

    await db.updateVideoFileWithCfStreamUid(fileId, cloudflareStreamUid, tusUploadUrl);

    res.status(201).json({ fileId, tusUploadUrl });
  } catch (e: any) {
    console.error(e.message);
    res.status(500).send('Error retrieving content upload url');
  }
});

app.listen(settings.PORT, async () => {
  console.log(`Listening on port ${settings.PORT}`);
});
