import * as db from './index';

// Function to insert a new profile into the 'profiles' table
export const insertProfile = async (organization: string, website: string, tag: string) => {
  const text = `
    INSERT INTO
      profiles(organization, website, tag)
      VALUES($1, $2, $3)
      RETURNING *`;
  const values = [organization, website, tag];

  // Execute the query and return the result
  return await db.queryDefault(text, [...values]);
};

// Function to select a profile from the 'profiles' table by its ID
export const selectProfileByID = async (id: string) => {
  const text = `SELECT * from profiles where id = $1;`;
  const values = [id];

  // Execute the query and return the result
  return await db.queryDefault(text, values);
};

// Function to select a profile from the 'profiles' table by its ID
export const selectProfilesByIdList = async (idList: any) => {
  const text = `SELECT * FROM profiles WHERE id = ANY($1::uuid[])`;
  const values = [idList];

  // Execute the query and return the result
  return await db.queryDefault(text, values);
};

// Function to select all of the profiles from the 'profiles' table
export const selectAllProfiles = async () => {
  const text = `SELECT id, organization, tag from profiles;`;

  // Execute the query and return the result
  return await db.queryDefault(text);
};

// Function to select a profile from the 'profiles' table by its tag
export const selectProfileByTag = async (tag: string) => {
  const text = `SELECT * from profiles where tag = $1;`;
  const values = [tag];

  // Execute the query and return the result
  return await db.queryDefault(text, values);
};

// Function to delete a profile from the 'profiles' table by its ID
export const deleteProfile = async (profileId: string) => {
  const sql = `
    DELETE FROM
      profiles
    WHERE
      id = $1
    RETURNING *
  `;

  // Execute the query and return the result
  return await db.querySingleDefault(sql, [profileId]);
};

// Function to update a profile in the 'profiles' table by its ID and given arguments
export const updateProfile = async (profileId: string, ...args: string[]) => {
  let sql = 'UPDATE profiles SET';
  const placeholders = [];
  const COLUMN_NAMES = [
    'organization',
    'website',
    'heroFileId',
    'logoFileId',
    'description',
    'descriptionFileId',
    'budget'
  ];
  let count = 0;
  let columnCount = 0;

  // Iterate over the provided arguments and create placeholders for each non-null and non-undefined value
  for (const arg of args) {
    if (arg !== null && arg !== undefined) {
      placeholders.push(` ${COLUMN_NAMES[columnCount]} = $${count + 2}`);
      count++;
    }
    columnCount++;
  }

  // If no arguments are provided, throw an error
  if (placeholders.length === 0) {
    throw new Error('No arguments provided to updateProfile');
  }

  // Complete the SQL query with the placeholders and the given profileId
  sql += placeholders.join(',');
  sql += ' WHERE id = $1 RETURNING *';
  const argList = [profileId, ...args.filter((arg) => arg !== null && arg !== undefined)];

  return await db.queryDefault(sql, argList);
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

  const r = await db.queryIdentity(sql, [uuid, profileId]);
  return !!r.rows[0].exists;
};
