import * as db from './index';

export const insertIdentity = (
  name: string,
  email: string,
  profileId: string,
  password: string,
  permissionIds: string[],
  hasAcceptedTerms: boolean,
  hasAcceptedNewsletter: boolean
) => {
  const text = `
    INSERT INTO
      users(name, email, profile_id, password, permission_ids, is_active, has_accepted_terms, has_accepted_newsletter)
      VALUES($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`;
  const values = [
    name,
    email,
    profileId,
    password,
    `{${permissionIds.join(',')}}`,
    `false`,
    `${hasAcceptedTerms}`,
    `${hasAcceptedNewsletter}`
  ];

  return db.query(text, values);
};

export const updateEmail = (id: string, email: string) => {
  const text = `UPDATE users SET email = $1, has_verified_email = false WHERE id = $2;`;
  const values = [email, id];

  return db.query(text, values);
};

export const updatePassword = (id: string, password: string) => {
  const text = `UPDATE users SET password = $1 WHERE id = $2;`;
  const values = [password, id];

  return db.query(text, values);
};

export const selectUserByEmail = (email: string) => {
  const text = `SELECT * from users where email = $1;`;
  const values = [email];

  return db.query(text, values);
};

export const selectUserByID = (id: string) => {
  const text = `SELECT * from users where id = $1;`;
  const values = [id];

  return db.query(text, values);
};

export const updateEmailVerification = (id: string, hasBeenVerified: boolean) => {
  const text = `UPDATE users SET has_verified_email = $1 where id = $2;`;
  const values = [`${hasBeenVerified}`, id];

  return db.query(text, values);
};

export const addPermissionIds = (id: string, perms: string[]) => {
  const text = `UPDATE users SET permission_ids = array_cat(permission_ids, $1) WHERE id = $2;`
  const values = [`{${perms.join(',')}}`, id]

  return db.query(text, values);
} 

export const updateActiveStatus = (id: string, status: boolean) => {
  const text = `UPDATE users SET is_active = $1 where id = $2;`;
  const values = [`${status}`, id];

  return db.query(text, values);
}