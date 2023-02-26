import * as db from './index';

// CREATE TYPE file_storage_type AS ENUM ('cloudflare_stream', 'cloudflare_r2');
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

export interface VideoFileData {
  isStub?: boolean;
  isPrivate: boolean;
  upload: {
    userId: string;
    profileId: string;
    fileName: string;
    fileSizeBytes: number; // TODO: Might need to be string to handle files bigger than `Number.MAX_SAFE_INTEGER` bytes. (Use BigInt in JS/TS.)
    debug: { // TODO: Imnplement cleanup cron job
      reserveDurationSeconds: number;
      urlValidDurationSeconds: number;
      tusUploadUrl?: string;
    };
  };
  cloudflareStreamUid?: string;
}

export const insertVideoFileStub = async (data: VideoFileData) => {
  data.isStub = true;

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

  const values = ['cloudflare_stream', JSON.stringify(data)];

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
            '{isStub}', 'false', true
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

export interface S3FileData {
  isStub?: boolean;
  isPrivate: boolean;
  upload: {
    userId: string;
    profileId: string;
    fileName: string;
    fileSizeBytes: number; // TODO: Might need to be string to handle files bigger than `Number.MAX_SAFE_INTEGER` bytes. (Use BigInt in JS/TS.)
    debug: { // TODO: Imnplement cleanup cron job
      urlValidDurationSeconds: number;
      presignedUrl?: string;
    };
  };
  filePathInBucket?: string;
}

export const insertS3FileStub = async (data: S3FileData) => {
  data.isStub = true;

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

  const values = ['cloudflare_r2', JSON.stringify(data)];

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
            '{isStub}', 'false', true
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
