import express, { Request, Response } from 'express';

import mime from 'mime';
import * as db from './db/queries/cloudflare';
import * as settings from './settings';
import * as stream from './utils/stream';

import { allowIfAnyOf, extractUser } from './middleware/auth';
import { UUID_REGEXP, parseTusUploadMetadata } from './utils/utils';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { VideoPlayerInfo, NonVideoPlayerInfo } from './types/cloudflare';
import { s3 } from './utils/r2';

export const cloudflare = express.Router();

/**
 * Cloudflare Service
 *
 * This service handles operations related to file uploads and management in Cloudflare,
 * including generating presigned URLs for uploads and retrieving file information.
 *
 * @module CloudflareService
 */

/**
 * Reserve a video upload slot using TUS protocol.
 *
 * @function
 * @name post/upload/video-tus-reservation
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {String} TUS upload URL
 */
cloudflare.post('/upload/video-tus-reservation', allowIfAnyOf('anonymous', 'active'), async (req: Request, res: Response) => {
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

    const r = await db.insertVideoFileStubWithForcedFileId(fileId, {
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

    const dbFileStub = r?.dataValues;
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

/**
 * Generate an S3 presigned URL for file upload.
 *
 * @function
 * @name post/upload/s3-presigned-url
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {JSON} Presigned URL and file ID
 */
cloudflare.post('/upload/s3-presigned-url', allowIfAnyOf('anonymous', 'active'), async (req: Request, res: Response) => {
  const {
    profileId,
    upload: { fileName, fileSizeBytes, mimeType, urlValidDurationSeconds = 30 * 60 }
  } = req.body;

  if (!fileName) {
    return res.status(400).send(`Invalid Request. 'upload.fileName' required`);
  }

  try {
    const { uuid: userId } = extractUser(req);

    const r = await db.insertS3FileStub({
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

    const dbFileStub = r?.dataValues;
    const fileId = dbFileStub.id;
    const filePathInBucket = `${fileId}/${fileName}`;
    const presignedUrl = await getPresignedUploadUrl(filePathInBucket, mimeType, urlValidDurationSeconds);

    //@ts-ignore
    await db.updateS3FileWithPresignedUrl(fileId, filePathInBucket, presignedUrl);

    res.status(201).json({ fileId, presignedUrl });
  } catch (e: any) {
    console.error('Error retrieving content upload url', e);
    res.status(500).send('Error retrieving content upload url' + e);
  }
});

/**
 * Fetch file details by file ID.
 *
 * @function
 * @name get/files/:fileId
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {JSON} File details
 */
cloudflare.get('/files/:fileId', allowIfAnyOf('anonymous', 'active'), async (req: Request, res: Response) => {
  const { fileId } = req.params;

  if (!UUID_REGEXP.test(fileId as string)) {
    return res.status(400).send(`Invalid 'fileId' path parameter, must be in UUID format.`);
  }

  try {
    const file = await getFile(fileId as string);
    res.status(200).json(file);
  } catch (e: any) {
    console.error('Error retrieving file', e);
    res.status(500).send('Error retrieving file' + e);
  }
});

/**
 * Get a presigned upload URL for S3.
 *
 * @function
 * @name getPresignedUploadUrl
 * @param {String} filePathInBucket - Path of the file in the S3 bucket
 * @param {String} mimeType - MIME type of the file
 * @param {Number} expiresIn - Expiration time for the presigned URL in seconds
 * @returns {Promise<String>} Presigned URL
 */
const getPresignedUploadUrl = async (filePathInBucket: string, mimeType: string, expiresIn: number) => {
  const putCommand = new PutObjectCommand({
    Bucket: settings.CLOUDFLARE_R2_BUCKET_NAME,
    Key: filePathInBucket,
    ContentType: mimeType
  });

  return await getSignedUrl(s3, putCommand, { expiresIn });
};

/**
 * Get file details by file ID.
 *
 * @function
 * @name getFile
 * @param {String} fileId - ID of the file
 * @returns {Promise<Object>} File details
 */
export const getFile = async (fileId: string) => {
  const r = await db.getFileById(fileId);
  if (r === null) {
    throw new Error('File ' + fileId + ' not found.');
  }

  let playerInfo: VideoPlayerInfo | NonVideoPlayerInfo = {};

  const dbFile = r?.dataValues;
  if ('cloudflareStream' === dbFile.storage_type) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    const videoDetails = await stream.getVideoDetails(dbFile.data.cloudflareStreamUid);
    if (!videoDetails) {
      throw new Error('File ' + fileId + ' not found.');
    }

    if (!videoDetails.readyToStream) {
      return;
    }

    playerInfo = {
      hlsUrl: videoDetails?.playback?.hls,
      dashUrl: videoDetails?.playback?.dash,
      videoIdOrSignedUrl: videoDetails?.uid
    };
  }

  if ('cloudflareR2' === dbFile.storage_type) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    const mimeType = mime.getType(dbFile.data.filePathInBucket) || 'application/octet-stream';

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    const fileType = mime.getExtension(mimeType) || 'bin';

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    const filePathInBucket = dbFile.data.filePathInBucket;
    const publicUrl = `${settings.CLOUDFLARE_R2_PUBLIC_BUCKET_BASE_URL}/${filePathInBucket}`;

    playerInfo = {
      mimeType,
      fileType,
      publicUrl,
      filePathInBucket
    };
  }

  return {
    id: fileId,
    createdAt: dbFile.created_at,
    updatedAt: dbFile.updated_at,
    storageType: dbFile.storage_type,
    playerInfo
  };
};
