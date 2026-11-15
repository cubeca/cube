import type { Sql } from '../sql';
import { table } from '../schema';
import { JSON_COLUMNS, type JsonRow } from '../types';
import { listByJsonIdStatement, searchPlaylistStatement } from '../search';

export async function getPlaylistById(sql: Sql, schema: string, playlistId: string): Promise<JsonRow | null> {
  const rows = await sql.query<JsonRow>(`SELECT ${JSON_COLUMNS} FROM ${table(schema, 'playlists')} WHERE id = $1 LIMIT 1`, [playlistId]);
  return rows[0] ?? null;
}

export async function listPlaylistsByProfileOrUserId(
  sql: Sql,
  schema: string,
  offset: number,
  limit: number,
  profileId?: string,
  userId?: string
): Promise<JsonRow[]> {
  const matches: { column: string; value: unknown }[] = [];
  if (profileId) matches.push({ column: 'profileId', value: profileId });
  if (userId) matches.push({ column: 'userId', value: userId });
  const statement = listByJsonIdStatement(table(schema, 'playlists'), offset, limit, matches, true);
  return sql.query<JsonRow>(statement.text, statement.params);
}

export async function searchPlaylist(
  sql: Sql,
  schema: string,
  offset: number,
  limit: number,
  filters: Record<string, unknown>,
  searchTerm: string
): Promise<JsonRow[]> {
  const statement = searchPlaylistStatement(table(schema, 'playlists'), offset, limit, filters, searchTerm);
  return sql.query<JsonRow>(statement.text, statement.params);
}

export async function insertPlaylist(sql: Sql, schema: string, data: Record<string, unknown>): Promise<JsonRow> {
  const rows = await sql.query<JsonRow>(
    `INSERT INTO ${table(schema, 'playlists')} (id, created_at, updated_at, data)
     VALUES (gen_random_uuid(), now(), now(), $1::jsonb)
     RETURNING ${JSON_COLUMNS}`,
    [JSON.stringify(data)]
  );
  const row = rows[0];
  if (!row) throw new Error('Failed to insert playlist');
  return row;
}

export async function updatePlaylist(sql: Sql, schema: string, playlistId: string, data: Record<string, unknown>): Promise<JsonRow | null> {
  const rows = await sql.query<JsonRow>(
    `UPDATE ${table(schema, 'playlists')} SET data = $2::jsonb WHERE id = $1 RETURNING ${JSON_COLUMNS}`,
    [playlistId, JSON.stringify(data)]
  );
  return rows[0] ?? null;
}

export async function addContentToPlaylist(sql: Sql, schema: string, playlistId: string, contentId: string): Promise<JsonRow | null> {
  const playlist = await getPlaylistById(sql, schema, playlistId);
  if (!playlist) return null;
  const contentIds = Array.isArray(playlist.data.contentIds) ? (playlist.data.contentIds as string[]) : [];
  if (contentIds.includes(contentId)) return null;
  return updatePlaylist(sql, schema, playlistId, { ...playlist.data, contentIds: [...contentIds, contentId] });
}

export async function removeContentFromPlaylist(sql: Sql, schema: string, playlistId: string, contentId: string): Promise<JsonRow | null> {
  const playlist = await getPlaylistById(sql, schema, playlistId);
  if (!playlist) return null;
  const contentIds = Array.isArray(playlist.data.contentIds) ? (playlist.data.contentIds as string[]) : [];
  const updated = contentIds.filter((id) => id !== contentId);
  return updatePlaylist(sql, schema, playlistId, { ...playlist.data, contentIds: updated });
}

export async function isUserAssociatedToPlaylist(sql: Sql, schema: string, uuid: string, playlistId: string): Promise<boolean> {
  const rows = await sql.query(`SELECT id FROM ${table(schema, 'playlists')} WHERE id = $2 AND ("data"#>>'{userId}') = $1 LIMIT 1`, [
    uuid,
    playlistId
  ]);
  return rows.length > 0;
}

export async function deletePlaylist(sql: Sql, schema: string, playlistId: string): Promise<number> {
  const rows = await sql.query<{ id: string }>(`DELETE FROM ${table(schema, 'playlists')} WHERE id = $1 RETURNING id`, [playlistId]);
  return rows.length;
}
