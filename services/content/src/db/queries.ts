import * as db from './index';

export const getContentById = async (contentId: string) => {
  const sql = `SELECT * FROM content WHERE id = $1`;
  return await db.querySingleDefault(sql, contentId);
};

export const listContentByProfileId = async (offset: number, limit: number, profileId: string, filters: any) => {
  let values: string[] = [];
  let placeholders = '';
  if (filters) {
    placeholders = Object.keys(filters)
      .map((key, i) => {
        if (key === 'tags') {
          return `(data->>'${key}')::TEXT ILIKE ANY (ARRAY[ $${i + 2} ])`;
        } else {
          return `(data->>'${key}')::TEXT ILIKE '%' || $${i + 2} || '%'`;
        }
      })
      .join(' AND ');

    if (filters.tags) {
      // Convert the `tags` array to a comma-separated string wrapped in % signs
      const tagsString = filters.tags.map((tag: any) => `%${tag}%`).join(', ');

      // Replace the `tags` array in `content` with the new string
      filters = JSON.parse(JSON.stringify(filters).replace(/"tags":\s*\[[^\]]*\]/, `"tags": "${tagsString}"`));
    }

    values = Object.values(filters);
  }

  const sql = `
    SELECT *
    FROM content
    WHERE (data->>'profileId')::TEXT = $1
    ${placeholders ? `AND ${placeholders}` : ''}
    ORDER BY updated_at DESC
    LIMIT $${values.length + 2}
    OFFSET $${values.length + 3}
`;

  const dbResult = await db.queryDefault(sql, profileId, ...values, limit, offset);
  return dbResult.rows;
};

export const insertContent = async (data: any) => {
  const sql = `
    INSERT INTO content (
      data
    )
    VALUES (
      $1
    )
    RETURNING *
  `;

  return await db.querySingleDefault(sql, data);
};

export const updateContent = async (data: any, contentId: string) => {
  const sql = `
    UPDATE
      content
    SET 
      data = $1
    WHERE
      id = $2
    RETURNING *
  `;

  return await db.querySingleDefault(sql, JSON.stringify(data), contentId);
};

export const deleteContent = async (contentId: string) => {
  const sql = `
    DELETE FROM
      content
    WHERE
      id = $1
    RETURNING *
  `;

  return await db.querySingleDefault(sql, contentId);
};

export const isUserAssociatedToProfile = async(uuid: string, profileId: string) => {
  const sql = `
    SELECT EXISTS (
      SELECT 1 
        FROM users 
      WHERE id = $1
        AND profile_id = $2
    ) as "exists";
  `;

  return await db.queryIdentity(sql, ...[uuid, profileId]);
}
