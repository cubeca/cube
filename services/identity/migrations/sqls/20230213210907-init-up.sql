-- user password is: abc123456789***
-- This hashed password only works if the ENCRYPT_SECRET env var (a.k.a. IDENTITY_PASSWORD_ENCRYPTION_SECRET) is set to "encrypt_secret"
INSERT INTO
  users(name, email, password, permission_ids, has_accepted_terms, has_accepted_newsletter, is_over_18)
VALUES (
  'First User',
  'firstuser@cubecommons.ca',
  'U2FsdGVkX1/+xS8YDJRzqHDIlbmhXdmJyAqSCcO8/NZq6MCRyy0lfuGq3RNSdn3zq512CUryaI5X579jz8flaiVePLcAJjOf0osVN6oWRD0=',
  '{active,contentEditor}',
  true,
  true,
  false
)
