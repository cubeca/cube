import type { Sql } from '../sql';
import { table } from '../schema';
import { USER_COLUMNS, type UserRow } from '../types';

/**
 * Column mapping matches the existing function, whose parameter names are swapped
 * relative to the route call. `hasAcceptedTerms` here is the request's
 * `hasAcceptedNewsletter`, and the next argument is the request's `hasAcceptedTerms`.
 */
export async function insertIdentity(
  sql: Sql,
  schema: string,
  name: string,
  email: string,
  profileId: string,
  password: string,
  hasAcceptedTerms: boolean,
  hasAcceptedNewsletter: boolean,
  isOver18: boolean,
  permissionIds: string[]
): Promise<UserRow> {
  try {
    const rows = await sql.query<UserRow>(
      `INSERT INTO ${table(schema, 'users')}
        (id, name, email, profile_id, password, permission_ids, is_active, has_verified_email, has_accepted_terms, has_accepted_newsletter, is_over_18)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, false, false, $6, $7, $8)
       RETURNING ${USER_COLUMNS}`,
      [name, email, profileId, password, permissionIds, hasAcceptedTerms, hasAcceptedNewsletter, isOver18]
    );
    const row = rows[0];
    if (!row) throw new Error('Failed to insert identity');
    return row;
  } catch (error) {
    if (error instanceof Error && error.message === 'Failed to insert identity') throw error;
    throw new Error('Failed to insert identity');
  }
}

export async function updateEmail(sql: Sql, schema: string, id: string, email: string): Promise<void> {
  const rows = await sql.query(`UPDATE ${table(schema, 'users')} SET email = $2, has_verified_email = false WHERE id = $1 RETURNING id`, [
    id,
    email
  ]);
  if (!rows[0]) throw new Error('User not found');
}

export async function updatePassword(sql: Sql, schema: string, id: string, password: string): Promise<void> {
  const rows = await sql.query(`UPDATE ${table(schema, 'users')} SET password = $2 WHERE id = $1 RETURNING id`, [id, password]);
  if (!rows[0]) throw new Error('User not found');
}

export async function selectUserByEmail(sql: Sql, schema: string, email: string): Promise<UserRow | null> {
  const rows = await sql.query<UserRow>(`SELECT ${USER_COLUMNS} FROM ${table(schema, 'users')} WHERE email = $1 LIMIT 1`, [email]);
  return rows[0] ?? null;
}

export async function selectUserByID(sql: Sql, schema: string, id: string): Promise<UserRow | null> {
  const rows = await sql.query<UserRow>(`SELECT ${USER_COLUMNS} FROM ${table(schema, 'users')} WHERE id = $1 LIMIT 1`, [id]);
  return rows[0] ?? null;
}

export async function updateEmailVerification(sql: Sql, schema: string, id: string, hasBeenVerified: boolean): Promise<void> {
  const rows = await sql.query(`UPDATE ${table(schema, 'users')} SET has_verified_email = $2 WHERE id = $1 RETURNING id`, [id, hasBeenVerified]);
  if (!rows[0]) throw new Error('User not found');
}

export async function addPermissionIds(sql: Sql, schema: string, id: string, perms: string[]): Promise<void> {
  const rows = await sql.query(
    `UPDATE ${table(schema, 'users')}
     SET permission_ids = COALESCE(permission_ids, '{}') || $2::varchar[]
     WHERE id = $1
     RETURNING id`,
    [id, perms]
  );
  if (!rows[0]) throw new Error('User not found');
}

export async function updateActiveStatus(sql: Sql, schema: string, id: string, status: boolean): Promise<void> {
  const rows = await sql.query(`UPDATE ${table(schema, 'users')} SET is_active = $2 WHERE id = $1 RETURNING id`, [id, status]);
  if (!rows[0]) throw new Error('User not found');
}
