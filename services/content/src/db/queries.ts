import * as db from './index';

export const getContentById = async (contentId: string) => {
  const sql = `SELECT * FROM content WHERE id = $1`;
  return await db.querySingleDefault(sql, contentId);
};

export const listContentByProfileId = async (offset: number, limit: number, filters: any, profileId?: string) => {
  const values: any[] = [];
  const whereClauses = [];

  if (profileId) {
    whereClauses.push(`(data->>'profileId')::TEXT = $${values.length + 1}`);
    values.push(profileId);
  }

  if (filters) {
    Object.keys(filters).forEach((key, i) => {
      if (key === 'tags') {
        whereClauses.push(`(data->>'${key}')::TEXT ILIKE ANY (ARRAY[ $${values.length + 1} ])`);
        values.push(filters[key].map((tag: any) => `%${tag}%`));
      } else {
        whereClauses.push(`(data->>'${key}')::TEXT ILIKE '%' || $${values.length + 1} || '%'`);
        values.push(filters[key]);
      }
    });
  }

  const sql = `
    SELECT *
    FROM content
    ${whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : ''}
    ORDER BY updated_at DESC
    LIMIT $${values.length + 1}
    OFFSET $${values.length + 2}
`;

  values.push(limit, offset);

  const dbResult = await db.queryDefault(sql, ...values);
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

export const isUserAssociatedToProfile = async (uuid: string, profileId: string) => {
  const sql = `
    SELECT EXISTS (
      SELECT 1 
        FROM users 
      WHERE id = $1
        AND profile_id = $2
    ) as "exists";
  `;

  const r = await db.queryIdentity(sql, ...[uuid, profileId]);
  return !!r.rows[0].exists;
};

export const searchContent = async (offset: number, limit: number, filters: any, searchTerm: string) => {
  const sql = `
  
  `;

  return await db.querySingleDefault(sql, searchTerm);
};
