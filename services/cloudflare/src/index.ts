import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import axios from 'axios';

import * as db from './db/queries';
import * as settings from './settings';
import { allowIfAnyOf } from './auth';
import { makeCloudflareTusUploadMetadata } from './utils';

export const CLOUDFLARE_API_STREAM = `https://api.cloudflare.com/client/v4/accounts/${settings.CLOUDFLARE_ACCOUNT_ID}/stream?direct_user=true`;

const app = express();

app.use(cors());
app.use(express.json());

export interface Headers { [k: string]: string };

app.post('/upload/video-tus-reservation', allowIfAnyOf('contentEditor'), async (req: Request, res: Response) => {
  const {
    uploadLength,
    reserveDurationSeconds,
    isPrivate = false,
    urlValidDurationSeconds = 30 * 60,
    uploadingUserId,
    orgId,
    fileName = ''
  } = req.body;

  if (!uploadLength) {
    return res.status(400).send(`Invalid Request. 'uploadLength' required`);
  }

  if (!reserveDurationSeconds) {
    return res.status(400).send(`Invalid Request. 'reserveDurationSeconds' required`);
  }

  const headers:Headers = {
    Authorization: `bearer ${settings.CLOUDFLARE_API_TOKEN}`,
    'Tus-Resumable': '1.0.0',
    'Upload-Length': String(uploadLength),
    'Upload-Metadata': makeCloudflareTusUploadMetadata({
      reserveDurationSeconds,
      isPrivate,
      urlValidDurationSeconds,
      uploadingUserId
    })
  };

  if (orgId) {
    headers['Upload-Creator'] = `org:${orgId}`;
  }

  try {
    const cfResponse = await axios.post(CLOUDFLARE_API_STREAM, null, { headers });

    const tusUploadUrl = cfResponse.headers['location'];
    const cloudflareStreamUid = cfResponse.headers['stream-media-id'];

    const dbFile = await db.insertVideoFile(
      cloudflareStreamUid as string,
      req?.user?.uuid as string,
      fileName as string
    );

    // res.set({
    //   "Access-Control-Expose-Headers": "Location",
    //   "Access-Control-Allow-Headers": "*",
    //   "Access-Control-Allow-Origin": "*",
    //   Location: tusUploadUrl,
    // })
    res.status(201).json({ id: dbFile.id, tusUploadUrl });
  } catch (e: any) {
    console.error(e.message);
    res.status(500).send('Error retrieving content upload url');
  }
});

app.listen(settings.PORT, async () => {
  console.log(`Listening on port ${settings.PORT}`);
});
