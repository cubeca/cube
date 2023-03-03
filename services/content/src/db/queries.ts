import * as db from './index';

// CREATE TABLE content (
//     id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
//     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
//     -- An automated `updated_at` would need a trigger, which would need `CREATE
//     -- LANGUAGE plpgsql;`, etc.
//     -- See https://stackoverflow.com/questions/1035980/update-timestamp-when-row-is-updated-in-postgresql
//     -- For now, not automated at SQL level.
//     updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
//     data JSONB NOT NULL DEFAULT '{}'::JSONB
// );
// CREATE INDEX content_by_profile_id ON content USING HASH (((data->'profileId')::TEXT));

export const getContentById = async (contentId: string) => {
  const sql = `SELECT * FROM content WHERE id = $1`;
  const values = [contentId];
  const dbResult = await db.query(sql, values);
  return (dbResult.rows.length === 0) ? null : dbResult.rows[0];
};

export const listContentByProfileId = async (profileId: string) => {
  // This should use index `content_by_profile_id`
  const sql = `SELECT * FROM content WHERE (data->'profileId')::TEXT = $1`;
  const values = [profileId];
  const dbResult = await db.query(sql, values);
  return dbResult.rows;
};

export interface ContentData {
  profileId: string;
}

export const insertContent = async (data: ContentData, profileId:string) => {
  data.profileId = profileId;

  const sql = `
    INSERT INTO files (
      data
    )
    VALUES (
      $1
    )
    RETURNING *
  `;

  const values = [JSON.stringify(data)];

  return (await db.query(sql, values)).rows[0];
};
