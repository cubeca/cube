import * as db from '.';

export const insertFileDetails = (
  cloudflareUUID: string,
  fileOwnerUUID: string,
  filename: string
) => {
  const text =
    'INSERT INTO file_upload_details(cloudflare_uuid, file_owner_uuid, filename) VALUES($1, $2, $3) RETURNING *';
  const values = [cloudflareUUID, fileOwnerUUID, filename];

  return db.query(text, values);
};
