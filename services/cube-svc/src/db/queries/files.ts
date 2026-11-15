import type { Sql } from '../sql';
import { table } from '../schema';
import { FILE_COLUMNS, type FileRow } from '../types';

export async function insertFile(
  sql: Sql,
  schema: string,
  storageType: string,
  data: Record<string, unknown>,
  id?: string
): Promise<FileRow> {
  const rows = await sql.query<FileRow>(
    `INSERT INTO ${table(schema, 'files')} (id, storage_type, created_at, updated_at, data)
     VALUES (COALESCE($1::uuid, gen_random_uuid()), $2, now(), now(), $3::jsonb)
     RETURNING ${FILE_COLUMNS}`,
    [id ?? null, storageType, JSON.stringify(data)]
  );
  const row = rows[0];
  if (!row) throw new Error('Failed to insert file');
  return row;
}

/** Replaces the JSON document. The previous upload metadata is not merged back in. */
export async function replaceFileData(sql: Sql, schema: string, fileId: string, data: Record<string, unknown>): Promise<FileRow | null> {
  const rows = await sql.query<FileRow>(`UPDATE ${table(schema, 'files')} SET data = $2::jsonb WHERE id = $1 RETURNING ${FILE_COLUMNS}`, [
    fileId,
    JSON.stringify(data)
  ]);
  return rows[0] ?? null;
}

export async function getFileById(sql: Sql, schema: string, fileId: string): Promise<FileRow | null> {
  const rows = await sql.query<FileRow>(`SELECT ${FILE_COLUMNS} FROM ${table(schema, 'files')} WHERE id = $1 LIMIT 1`, [fileId]);
  return rows[0] ?? null;
}

export async function deleteFileById(sql: Sql, schema: string, fileId: string): Promise<void> {
  const file = await getFileById(sql, schema, fileId);
  if (!file) throw new Error('File not found');
  await sql.query(`DELETE FROM ${table(schema, 'files')} WHERE id = $1`, [fileId]);
}
