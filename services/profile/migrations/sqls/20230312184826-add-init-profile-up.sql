-- user password is: abc123456789***
INSERT INTO
  profiles(id, organization, website, tag, heroUrl, logoUrl, description, descriptionUrl)
VALUES (

  -- see services/identity/migrations/sqls/20230312175004-alter-users-up.sql
  'c141667d-50fc-4610-99f4-b87fcd6f77aa',

  'First Organization',
  'https://www.firstorganization.org',
  '@firstorg',
  '',
  '',
  'Description of the first organization',
  ''
);