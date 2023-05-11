import * as db from './index';

// CREATE TYPE file_storage_type AS ENUM ('cloudflareStream', 'cloudflareR2');
// CREATE TABLE files (
//     id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
//     storage_type file_storage_type NOT NULL,
//
//     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
//
//     -- An automated `updated_at` would need a trigger, which would need `CREATE
//     -- LANGUAGE plpgsql;`, etc.
//     -- See https://stackoverflow.com/questions/1035980/update-timestamp-when-row-is-updated-in-postgresql
//     -- For now, not automated at SQL level.
//     updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
//
//     data JSONB NOT NULL DEFAULT '{}'::JSONB
// );

export enum FileStatus {
  Stub = 'stub',
  UploadAuthorized = 'uploadAuthorized',

}

export interface CommonDebugInfo {
  urlValidDurationSeconds: number;
}

export interface CommonUploadInfo {
  userId: string;
  fileName: string;
  fileSizeBytes: number;
  debug: CommonDebugInfo; // TODO: Implement cleanup cron job
}

export interface CommonFileData {
  status?: FileStatus;
  profileId: string;
  upload: CommonUploadInfo;
}

export interface VideoDebugInfo extends CommonDebugInfo {
  reserveDurationSeconds: number;
  tusUploadUrl?: string;
}

export interface VideoUploadInfo extends CommonUploadInfo {
  debug: VideoDebugInfo; // TODO: Implement cleanup cron job
}

export interface VideoFileData extends CommonFileData  {
  upload: VideoUploadInfo;
  cloudflareStreamUid?: string;
}

export interface S3DebugInfo extends CommonDebugInfo {
  presignedUrl?: string;
}

export interface S3UploadInfo extends CommonUploadInfo {
  mimeType: string;
  debug: S3DebugInfo; // TODO: Implement cleanup cron job
}

export interface S3FileData extends CommonFileData  {
  upload: S3UploadInfo;
  filePathInBucket?: string;
}

export const insertVideoFileStub = async (data: VideoFileData) => {
  data.status = FileStatus.Stub;

  const sql = `
    INSERT INTO files (
      storage_type,
      data
    )
    VALUES (
      'cloudflareStream',
      $1
    )
    RETURNING *
  `;

  const values = [JSON.stringify(data)];

  return (await db.query(sql, values)).rows[0];
};

export const insertVideoFileStubWithForcedFileId = async (fileId: string, data: VideoFileData) => {
  data.status = FileStatus.Stub;

  const sql = `
    INSERT INTO files (
      id,
      storage_type,
      data
    )
    VALUES (
      $1,
      'cloudflareStream',
      $2
    )
    RETURNING *
  `;

  const values = [fileId, JSON.stringify(data)];

  return (await db.query(sql, values)).rows[0];
};

export const updateVideoFileWithCfStreamUid = async (fileId: string, cloudflareStreamUid: string, tusUploadUrl: string) => {

  // TODO Figure out DB transactions with this JS client lib, then do a
  // SELECT all JSON -> manipulate JSON in JS -> UPDATE JSON in bulk.
  const sql = `
    UPDATE files
    SET
      data = jsonb_set(
        jsonb_set(
          jsonb_set(
            data,
            '{status}', '"uploadAuthorized"', true
          ),
          '{upload,debug,tusUploadUrl}', $1, true
        ),
        '{cloudflareStreamUid}', $2, true
      ),
      updated_at = transaction_timestamp()
    WHERE
      id = $3
  `;

  const values = [JSON.stringify(tusUploadUrl), JSON.stringify(cloudflareStreamUid), fileId];

  await db.query(sql, values);
};

export const insertS3FileStub = async (data: S3FileData) => {
  data.status = FileStatus.Stub;

  const sql = `
    INSERT INTO files (
      storage_type,
      data
    )
    VALUES (
      $1,
      $2
    )
    RETURNING *
  `;

  const values = ['cloudflareR2', JSON.stringify(data)];

  return (await db.query(sql, values)).rows[0];
};

export const updateS3FileWithPresignedUrl = async (fileId: string, filePathInBucket: string, presignedUrl: string) => {

  // TODO Figure out DB transactions with this JS client lib, then do a
  // SELECT all JSON -> manipulate JSON in JS -> UPDATE JSON in bulk.
  const sql = `
    UPDATE files
    SET
      data = jsonb_set(
        jsonb_set(
          jsonb_set(
            data,
            '{status}', '"uploadAuthorized"', true
          ),
          '{upload,debug,presignedUrl}', $1, true
        ),
        '{filePathInBucket}', $2, true
      ),
      updated_at = transaction_timestamp()
    WHERE
      id = $3
  `;

  const values = [JSON.stringify(presignedUrl), JSON.stringify(filePathInBucket), fileId];

  await db.query(sql, values);
};

export const getFileById = async (fileId: string) => {
  const sql = `SELECT * FROM files WHERE id = $1`;
  const values = [fileId];
  const dbResult = await db.query(sql, values);
  return (dbResult.rows.length === 0) ? null : dbResult.rows[0];
};
