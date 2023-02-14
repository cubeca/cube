import * as db from './index';

export const insertFileDetails = (
  streamMediaUUID: string,
  fileOwnerUUID: string,
  filename: string
) => {
  const text =
    'INSERT INTO file_upload_details(stream_media_uuid, file_owner_uuid, filename) VALUES($1, $2, $3) RETURNING *';
  const values = [streamMediaUUID, fileOwnerUUID, filename];

  return db.query(text, values);
};
