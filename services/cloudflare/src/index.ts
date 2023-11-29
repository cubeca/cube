import express, { Request, Response } from 'express';
import cors from 'cors';
import mime from 'mime';
import * as db from './db/queries';
import * as settings from './settings';
import { allowIfAnyOf, extractUser } from './auth';
import { parseTusUploadMetadata } from './utils';
import * as stream from './stream';
import { getPresignedUploadUrl } from './r2';

export const UUID_REGEXP = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const app = express();

app.use(cors());
app.use(express.json());

app.post('/upload/video-tus-reservation', allowIfAnyOf('contentEditor'), async (req: Request, res: Response) => {
  const fileId = req.query.fileId as string;

  if (!fileId) {
    console.error(400, `Invalid Request. 'fileId' query parameter required`);
    return res.status(400).send(`Invalid Request. 'fileId' query parameter required`);
  }

  const { 'upload-length': tusUploadLength, 'upload-metadata': tusUploadMetadata } = req.headers;

  if (!tusUploadLength) {
    console.error(400, `Invalid Request. 'Upload-Length' header required`);
    return res.status(400).send(`Invalid Request. 'Upload-Length' header required`);
  }

  if (!tusUploadMetadata) {
    console.error(400, `Invalid Request. 'Upload-Metadata' header required`);
    return res.status(400).send(`Invalid Request. 'Upload-Metadata' header required`);
  }

  const meta = parseTusUploadMetadata(tusUploadMetadata);
  const { fileName, profileId, allocVidTime = 60 * 60, validFor = 30 * 60 } = meta;

  if (!allocVidTime) {
    console.error(400, `Invalid Request. 'allocVidTime' field in 'Upload-Metadata' header required`);
    return res.status(400).send(`Invalid Request. 'allocVidTime' field in 'Upload-Metadata' header required`);
  }

  const reserveDurationSeconds = Math.ceil(Number(allocVidTime));
  const urlValidDurationSeconds = Math.ceil(Number(validFor));

  try {
    const { uuid: userId } = extractUser(req);

    const dbFileStub = await db.insertVideoFileStubWithForcedFileId(fileId, {
      profileId,
      upload: {
        userId,
        fileName,
        fileSizeBytes: Number(tusUploadLength),
        debug: {
          reserveDurationSeconds,
          urlValidDurationSeconds
        }
      }
    });

    if (fileId != dbFileStub.id) {
      return res.status(500).send('Error creating the DB entry for this file');
    }

    const { tusUploadUrl, cloudflareStreamUid } = await stream.getTusUploadUrl(
      fileId,
      Number(tusUploadLength),
      reserveDurationSeconds,
      urlValidDurationSeconds,
      userId
    );

    if (!tusUploadUrl || !cloudflareStreamUid) {
      return res.status(500).send('Error retrieving content upload url');
    }

    await db.updateVideoFileWithCfStreamUid(fileId, cloudflareStreamUid, tusUploadUrl);

    res.set({
      'Access-Control-Expose-Headers': 'Location',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Origin': '*',
      Location: tusUploadUrl
    });
    res.status(200).send('OK');
  } catch (e: any) {
    console.error('Error retrieving content upload url', e);
    res.status(500).send('Error retrieving content upload url' + e);
  }
});

app.post('/upload/s3-presigned-url', allowIfAnyOf('contentEditor'), async (req: Request, res: Response) => {
  const {
    profileId,
    upload: { fileName, fileSizeBytes, mimeType, urlValidDurationSeconds = 30 * 60 }
  } = req.body;

  if (!fileName) {
    return res.status(400).send(`Invalid Request. 'upload.fileName' required`);
  }

  try {
    const { uuid: userId } = extractUser(req);

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
    console.error('Error retrieving content upload url', e);
    res.status(500).send('Error retrieving content upload url' + e);
  }
});

export interface VideoPlayerInfo {
  hlsUrl?: string;
  dashUrl?: string;
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

// Route for checking if the service is running
app.get('/', async (req: Request, res: Response) => {
  try {
    res.status(200).send('Service is running');
  } catch (error) {
    res.status(500).send('Internal server error');
  }
});

app.listen(settings.PORT, async () => {
  console.log(`Listening on port ${settings.PORT}`);
});
