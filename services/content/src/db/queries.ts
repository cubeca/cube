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
  return await db.querySingle(sql, contentId);
};

export const listContentByProfileId = async (offset: number, limit: number, profileId: string) => {
  // This should use index `content_by_profile_id`
  const sql = `
    SELECT
      *
    FROM content
    WHERE
      (data->>'profileId')::TEXT = $1
    ORDER BY updated_at DESC
    LIMIT $2
    OFFSET $3
  `;
  const dbResult = await db.query(sql, profileId, limit, offset);
  return dbResult.rows;
};

export interface ContentData {
  profileId: string;
}

export const insertContent = async (data: ContentData, profileId: string) => {
  data.profileId = profileId;

  const sql = `
    INSERT INTO content (
      data
    )
    VALUES (
      $1
    )
    RETURNING *
  `;

  return await db.querySingle(sql, JSON.stringify(data));
};

export const updateContent = async (data: ContentData, contentId: string) => {
  const sql = `
    UPDATE
      content
    SET 
      data = $1
    WHERE
      id = $2
    RETURNING *
  `;

  return await db.querySingle(sql, JSON.stringify(data), contentId);
};

export const deleteContent = async (contentId: string) => {
  const sql = `
    DELETE FROM
      content
    WHERE
      id = $1
    RETURNING *
  `;

  return await db.querySingle(sql, contentId);
};