import type { Sql } from '../sql';
import { table } from '../schema';
import { PROFILE_COLUMNS, type ProfileRow } from '../types';
import { searchProfilesStatement } from '../search';

export async function insertProfile(sql: Sql, schema: string, organization: string, website: string, tag: string): Promise<ProfileRow> {
  try {
    const rows = await sql.query<ProfileRow>(
      `INSERT INTO ${table(schema, 'profiles')}
        (id, organization, website, tag, herofileid, logofileid, description, descriptionfileid, budget, status)
       VALUES (gen_random_uuid(), $1, $2, $3, '', '', '', '', '', 'active')
       RETURNING ${PROFILE_COLUMNS}`,
      [organization, website, tag]
    );
    const row = rows[0];
    if (!row) throw new Error('Failed to insert profile');
    return row;
  } catch (error) {
    if (error instanceof Error && error.message === 'Failed to insert profile') throw error;
    throw new Error('Failed to insert profile');
  }
}

export async function selectProfileByID(sql: Sql, schema: string, id: string): Promise<ProfileRow | null> {
  const rows = await sql.query<ProfileRow>(`SELECT ${PROFILE_COLUMNS} FROM ${table(schema, 'profiles')} WHERE id = $1 LIMIT 1`, [id]);
  return rows[0] ?? null;
}

export async function selectProfilesByIdList(sql: Sql, schema: string, idList: string[]): Promise<ProfileRow[]> {
  if (idList.length === 0) return [];
  return sql.query<ProfileRow>(`SELECT ${PROFILE_COLUMNS} FROM ${table(schema, 'profiles')} WHERE id = ANY($1::uuid[])`, [idList]);
}

export async function selectAllProfiles(sql: Sql, schema: string): Promise<Pick<ProfileRow, 'id' | 'organization' | 'tag'>[]> {
  return sql.query(`SELECT id, organization, tag FROM ${table(schema, 'profiles')}`);
}

export async function selectProfileByTag(sql: Sql, schema: string, tag: string): Promise<ProfileRow | null> {
  const rows = await sql.query<ProfileRow>(
    `SELECT ${PROFILE_COLUMNS} FROM ${table(schema, 'profiles')} WHERE LOWER("tag") = LOWER($1) LIMIT 1`,
    [tag]
  );
  return rows[0] ?? null;
}

export async function updateProfile(
  sql: Sql,
  schema: string,
  profileId: string,
  organization: string | undefined,
  website: string | undefined,
  heroFileId: string | null | undefined,
  logoFileId: string | null | undefined,
  description: string | null | undefined,
  descriptionFileId: string | null | undefined,
  budget: string | null | undefined,
  status: string | null | undefined
): Promise<ProfileRow | null> {
  const sets: string[] = [];
  const params: unknown[] = [];
  const add = (column: string, value: string | null | undefined) => {
    if (value === undefined) return;
    params.push(value);
    sets.push(`"${column}" = $${params.length}`);
  };

  add('organization', organization);
  add('website', website);
  add('herofileid', heroFileId);
  add('logofileid', logoFileId);
  add('description', description);
  add('descriptionfileid', descriptionFileId);
  add('budget', budget);
  add('status', status);

  if (sets.length === 0) return selectProfileByID(sql, schema, profileId);

  params.push(profileId);
  const rows = await sql.query<ProfileRow>(
    `UPDATE ${table(schema, 'profiles')} SET ${sets.join(', ')} WHERE id = $${params.length} RETURNING ${PROFILE_COLUMNS}`,
    params
  );
  return rows[0] ?? null;
}

export async function isUserAssociatedToProfile(sql: Sql, schema: string, uuid: string, profileId: string): Promise<boolean> {
  const rows = await sql.query(`SELECT id FROM ${table(schema, 'users')} WHERE id = $1 AND profile_id = $2 LIMIT 1`, [uuid, profileId]);
  return rows.length > 0;
}

export async function searchProfiles(sql: Sql, schema: string, offset: number, limit: number, searchTerm: string): Promise<ProfileRow[]> {
  const statement = searchProfilesStatement(table(schema, 'profiles'), offset, limit, searchTerm);
  return sql.query<ProfileRow>(statement.text, statement.params);
}
