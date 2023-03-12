import * as db from './index';

export const insertProfile = (organization: string, website: string, tag: string) => {
  const text = `
    INSERT INTO
      profiles(organization, website, tag)
      VALUES($1, $2, $3)
      RETURNING *`;
  const values = [organization, website, tag];

  return db.query(text, values);
};

export const selectProfileByID = (id: string) => {
  const text = `SELECT * from profiles where id = $1;`;
  const values = [id];

  return db.query(text, values);
};
