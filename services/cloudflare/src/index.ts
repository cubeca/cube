import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';

// TODO Replace with https://www.npmjs.com/package/file-type
import mime from 'mime';

import * as db from './db/queries';
import * as settings from './settings';
import { allowIfAnyOf, extractUser } from './auth';
import { inspect, parseTusUploadMetadata } from './utils';
import * as stream from './stream';
import { getPresignedUploadUrl } from './r2';

export const UUID_REGEXP = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const app = express();

app.use(cors());
app.use(express.json());

app.post('/upload/video-tus-reservation', allowIfAnyOf('contentEditor'), async (req: Request, res: Response) => {

  const {
    'upload-length': tusUploadLength,
    'upload-metadata': tusUploadMetadata,
  } = req.headers;

  if (!tusUploadLength) {
    return res.status(400).send(`Invalid Request. 'Upload-Length' header required`);
  }

  if (!tusUploadMetadata) {
    return res.status(400).send(`Invalid Request. 'Upload-Metadata' header required`);
  }

  const meta = parseTusUploadMetadata(tusUploadMetadata);

  const {
    fileName,
    // mimeType,
    profileId,
    allocVidTime,
    validFor = 30 * 60
  } = meta;

  // inspect('meta ==', meta);
  // return res.status(500).send('Error retrieving content upload url');

  if (!allocVidTime) {
    return res.status(400).send(`Invalid Request. 'allocVidTime' field in 'Upload-Metadata' header required`);
  }

  const reserveDurationSeconds = Number(allocVidTime);
  const urlValidDurationSeconds = Number(validFor);

  if (!reserveDurationSeconds) {
    return res.status(400).send(`Invalid Request. 'reserveDurationSeconds' required`);
  }

  try {
    const { id:userId } = extractUser(req);

    const dbFileStub = await db.insertVideoFileStub({
      profileId,
      upload: {
        userId,
        fileName,
        fileSizeBytes:Number(tusUploadLength),
        debug: {
          reserveDurationSeconds,
          urlValidDurationSeconds
        }
      }
    });

    const fileId = dbFileStub.id;

    const { tusUploadUrl, cloudflareStreamUid } = await stream.getTusUploadUrl(fileId, Number(tusUploadLength), reserveDurationSeconds, urlValidDurationSeconds, userId);

    if (!tusUploadUrl || !cloudflareStreamUid) {
      return res.status(500).send('Error retrieving content upload url');
    }

    await db.updateVideoFileWithCfStreamUid(fileId, cloudflareStreamUid, tusUploadUrl);

    res.set({
      "Access-Control-Expose-Headers": "Location,Cube-File-Id",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Origin": "*",
      "Cube-File-Id": fileId,
      Location: tusUploadUrl,
    })
    res.status(200).send("OK")
  } catch (e: any) {
    console.error(e.message);
    inspect(e);
    res.status(500).send('Error retrieving content upload url');
  }
});

app.post('/upload/s3-presigned-url', allowIfAnyOf('contentEditor'), async (req: Request, res: Response) => {
  const {
    profileId,
    upload: {
      fileName,
      fileSizeBytes,
      mimeType,
      urlValidDurationSeconds = 30 * 60
    }
  } = req.body;


  if (!fileName) {
    return res.status(400).send(`Invalid Request. 'upload.fileName' required`);
  }

  try {
    const { id:userId } = extractUser(req);

    const dbFileStub = await db.insertS3FileStub({
      profileId,
      upload: {
        userId,
        fileName,
        fileSizeBytes,
        mimeType,
        debug: {
          urlValidDurationSeconds
        }
      }
    });

    const fileId = dbFileStub.id;

    const filePathInBucket = `${fileId}/${fileName}`;
    const presignedUrl = await getPresignedUploadUrl(filePathInBucket, mimeType, urlValidDurationSeconds);

    await db.updateS3FileWithPresignedUrl(fileId, filePathInBucket, presignedUrl);

    res.status(201).json({ fileId, presignedUrl });
  } catch (e: any) {
    console.error(e.message);
    inspect(e);
    res.status(500).send('Error retrieving content upload url');
  }

});

export interface VideoPlayerInfo {
  hlsUrl?: string;
  dashUrl?: string;

  // See https://www.npmjs.com/package/@cloudflare/stream-react
  videoIdOrSignedUrl?: string;
}

export interface NonVideoPlayerInfo {
  mimeType: string;

  // TODO Improve mapping to supported FE "player" widgets, i.e. group mime/file types into `playerType`
  fileType: string;
  publicUrl: string;
}

app.get('/files/:fileId', allowIfAnyOf('anonymous', 'active'), async (req: Request, res: Response) => {
  const { fileId } = req.params;
  if (!UUID_REGEXP.test(fileId)) {
    return res.status(400).send(`Invalid 'fileId' path parameter, must be in UUID format.`);
  }
  const dbFile = await db.getFileById(fileId);
  if (dbFile === null) {
    return res.status(404).send('File not found.');
  }

  let playerInfo: VideoPlayerInfo | NonVideoPlayerInfo | undefined = undefined;

  if ('cloudflareStream' === dbFile.storage_type) {
    const videoDetails = await stream.getVideoDetails(dbFile.data.cloudflareStreamUid);
    if (!videoDetails) {
      return res.status(404).send('File not found.');
    }
    if (!videoDetails.readyToStream) {
      // inspect('Video is still being processed:', videoDetails);
      return res.status(409).send('Video is still being processed.');
    }
    playerInfo = {
      hlsUrl: videoDetails?.playback?.hls,
      dashUrl: videoDetails?.playback?.dash,
      videoIdOrSignedUrl: videoDetails?.uid
    };
  }

  if ('cloudflareR2' === dbFile.storage_type) {
    // TODO Replace with https://www.npmjs.com/package/file-type
    const mimeType = mime.getType(dbFile.data.filePathInBucket) || 'application/octet-stream';
    const publicUrl = `${settings.CLOUDFLARE_R2_PUBLIC_BUCKET_BASE_URL}/${dbFile.data.filePathInBucket}`;

    playerInfo = {
      mimeType,

      // TODO Improve mapping to supported FE "player" widgets, i.e. group mime/file types into `playerType`
      fileType: mime.getExtension(mimeType) || 'bin',
      publicUrl
    };
  }

  res.status(200).json({
    id: fileId,
    createdAt: dbFile.created_at,
    updatedAt: dbFile.updated_at,
    storageType: dbFile.storage_type,
    playerInfo
  });
});

app.listen(settings.PORT, async () => {
  console.log(`Listening on port ${settings.PORT}`);
});
