ALTER TABLE users
ADD profile_id varchar;

-- see services/profile/migrations/sqls/20230312184826-add-init-profile-up.sql
UPDATE users SET 
  profile_id = 'c141667d-50fc-4610-99f4-b87fcd6f77aa';
