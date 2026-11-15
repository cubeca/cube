import type { Hono } from 'hono';
import type { AppEnv } from '../app-env';
import { allowIfAnyOf, extractUser } from '../middleware/auth';
import * as filesDb from '../db/queries/files';
import { getFile } from '../services/files';
import { presignPut } from '../services/r2';
import { getTusUploadUrl } from '../services/stream';
import { text } from '../utils/http';
import { parseTusUploadMetadata } from '../utils/tus';
import { UUID_REGEXP } from '../utils/uuid';

function schemaOf(env: { DB_SCHEMA?: string }): string {
  return env.DB_SCHEMA || 'cube';
}

export function registerCloudflare(app: Hono<AppEnv>): void {
  app.post('/upload/video-tus-reservation', allowIfAnyOf('anonymous', 'active'), async (c) => {
    const fileId = c.req.query('fileId') ?? '';
    if (!fileId) return text(c, "Invalid Request. 'fileId' query parameter required", 400);
    const tusUploadLength = c.req.header('upload-length');
    const tusUploadMetadata = c.req.header('upload-metadata');
    if (!tusUploadLength) return text(c, "Invalid Request. 'Upload-Length' header required", 400);
    if (!tusUploadMetadata) return text(c, "Invalid Request. 'Upload-Metadata' header required", 400);

    const meta = parseTusUploadMetadata(tusUploadMetadata);
    const fileName = meta.fileName === true ? '' : meta.fileName;
    const profileId = meta.profileId === true ? '' : meta.profileId;
    const allocVidTime = meta.allocVidTime === true ? '' : (meta.allocVidTime ?? '');
    const validFor = meta.validFor === true ? '' : (meta.validFor ?? String(30 * 60));
    if (!allocVidTime) return text(c, "Invalid Request. 'allocVidTime' field in 'Upload-Metadata' header required", 400);

    const reserveDurationSeconds = Math.ceil(Number(allocVidTime));
    const urlValidDurationSeconds = Math.ceil(Number(validFor || 30 * 60));

    try {
      const { uuid: userId } = extractUser(c);
      const sql = c.get('sql');
      const schema = schemaOf(c.env);
      const created = await filesDb.insertFile(sql, schema, 'cloudflareStream', {
        status: 'stub',
        profileId,
        upload: {
          userId,
          fileName,
          fileSizeBytes: Number(tusUploadLength),
          debug: { reserveDurationSeconds, urlValidDurationSeconds }
        }
      }, fileId);
      if (fileId !== created.id) return text(c, 'Error creating the DB entry for this file', 500);

      const { tusUploadUrl, cloudflareStreamUid } = await getTusUploadUrl(
        c.env,
        fileId,
        Number(tusUploadLength),
        reserveDurationSeconds,
        urlValidDurationSeconds,
        userId
      );
      if (!tusUploadUrl || !cloudflareStreamUid) return text(c, 'Error retrieving content upload url', 500);

      await filesDb.replaceFileData(sql, schema, fileId, {
        status: 'uploadAuthorized',
        cloudflareStreamUid,
        upload: { debug: { tusUploadUrl } }
      });

      c.header('Access-Control-Expose-Headers', 'Location');
      c.header('Access-Control-Allow-Headers', '*');
      c.header('Access-Control-Allow-Origin', '*');
      c.header('Location', tusUploadUrl);
      return text(c, 'OK');
    } catch (error) {
      console.error('Error retrieving content upload url', error);
      return text(c, `Error retrieving content upload url${error}`, 500);
    }
  });

  app.post('/upload/s3-presigned-url', allowIfAnyOf('anonymous', 'active'), async (c) => {
    const body = await c.req.json().catch(() => null) as { profileId?: string; upload?: Record<string, unknown> } | null;
    const upload = body?.upload ?? {};
    const fileName = typeof upload.fileName === 'string' ? upload.fileName : '';
    if (!fileName) return text(c, "Invalid Request. 'upload.fileName' required", 400);
    const fileSizeBytes = Number(upload.fileSizeBytes ?? 0);
    const mimeType = typeof upload.mimeType === 'string' ? upload.mimeType : undefined;
    const urlValidDurationSeconds = Number(upload.urlValidDurationSeconds ?? 30 * 60);

    try {
      const { uuid: userId } = extractUser(c);
      const sql = c.get('sql');
      const schema = schemaOf(c.env);
      const created = await filesDb.insertFile(sql, schema, 'cloudflareR2', {
        status: 'stub',
        profileId: body?.profileId ?? '',
        upload: {
          userId,
          fileName,
          fileSizeBytes,
          mimeType,
          debug: { urlValidDurationSeconds }
        }
      });
      const fileId = created.id;
      const filePathInBucket = `${fileId}/${fileName}`;
      const presignedUrl = await presignPut(c.env, filePathInBucket, mimeType, urlValidDurationSeconds);
      await filesDb.replaceFileData(sql, schema, fileId, {
        status: 'uploadAuthorized',
        filePathInBucket,
        presignedUrl
      });
      return c.json({ fileId, presignedUrl }, 201);
    } catch (error) {
      console.error('Error retrieving content upload url', error);
      return text(c, `Error retrieving content upload url${error}`, 500);
    }
  });

  app.get('/files/:fileId', allowIfAnyOf('anonymous', 'active'), async (c) => {
    const fileId = c.req.param('fileId');
    if (!UUID_REGEXP.test(fileId)) return text(c, "Invalid 'fileId' path parameter, must be in UUID format.", 400);
    try {
      const file = await getFile(c.get('sql'), schemaOf(c.env), c.env, fileId);
      if (!file) return c.body(null, 200, { 'Content-Type': 'application/json' });
      return c.json(file);
    } catch (error) {
      console.error('Error retrieving file', error);
      return text(c, `Error retrieving file${error}`, 500);
    }
  });
}
