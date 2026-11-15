import type { Sql } from '../sql';
import { table } from '../schema';
import { JSON_COLUMNS, type JsonRow } from '../types';
import { listByJsonIdStatement, searchContentStatement } from '../search';

export async function getContentById(sql: Sql, schema: string, contentId: string): Promise<JsonRow | null> {
  const rows = await sql.query<JsonRow>(`SELECT ${JSON_COLUMNS} FROM ${table(schema, 'content')} WHERE id = $1 LIMIT 1`, [contentId]);
  return rows[0] ?? null;
}

export async function insertContent(sql: Sql, schema: string, data: Record<string, unknown>): Promise<JsonRow> {
  const rows = await sql.query<JsonRow>(
    `INSERT INTO ${table(schema, 'content')} (id, created_at, updated_at, data)
     VALUES (gen_random_uuid(), now(), now(), $1::jsonb)
     RETURNING ${JSON_COLUMNS}`,
    [JSON.stringify(data)]
  );
  const row = rows[0];
  if (!row) throw new Error('Failed to insert content');
  return row;
}

export async function updateContent(sql: Sql, schema: string, data: Record<string, unknown>, contentId: string): Promise<JsonRow | null> {
  const rows = await sql.query<JsonRow>(
    `UPDATE ${table(schema, 'content')} SET data = $2::jsonb WHERE id = $1 RETURNING ${JSON_COLUMNS}`,
    [contentId, JSON.stringify(data)]
  );
  return rows[0] ?? null;
}

export async function deleteContent(sql: Sql, schema: string, contentId: string): Promise<JsonRow> {
  const content = await getContentById(sql, schema, contentId);
  if (!content) throw new Error('Content not found');
  await sql.query(`DELETE FROM ${table(schema, 'content')} WHERE id = $1`, [contentId]);
  return content;
}

export async function isUserAssociatedToProfile(sql: Sql, schema: string, uuid: string, profileId: string): Promise<boolean> {
  const rows = await sql.query(`SELECT id FROM ${table(schema, 'users')} WHERE id = $1 AND profile_id = $2 LIMIT 1`, [uuid, profileId]);
  return rows.length > 0;
}

export async function searchContent(
  sql: Sql,
  schema: string,
  offset: number,
  limit: number,
  filters: Record<string, unknown>,
  searchTerm: string
): Promise<JsonRow[]> {
  const statement = searchContentStatement(table(schema, 'content'), offset, limit, filters, searchTerm, new Date().toISOString());
  return sql.query<JsonRow>(statement.text, statement.params);
}

export async function listContentByProfileId(
  sql: Sql,
  schema: string,
  offset: number,
  limit: number,
  filters: Record<string, unknown>,
  profileId?: string
): Promise<JsonRow[]> {
  const matches: { column: string; value: unknown }[] = [];
  if (profileId) matches.push({ column: 'profileId', value: profileId });
  if (filters.category) matches.push({ column: 'category', value: filters.category });
  const statement = listByJsonIdStatement(table(schema, 'content'), offset, limit, matches, false);
  return sql.query<JsonRow>(statement.text, statement.params);
}
