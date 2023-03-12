ALTER TABLE users
ADD profile_id varchar;

UPDATE users SET 
  profile_id = '123';