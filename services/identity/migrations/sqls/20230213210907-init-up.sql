-- user password is: abc123456789***
INSERT INTO
  users(name, email, password, permission_ids, has_accepted_terms, has_accepted_newsletter)
VALUES (
  'First User',
  'firstuser@cubecommons.ca',
  'U2FsdGVkX1/+xS8YDJRzqHDIlbmhXdmJyAqSCcO8/NZq6MCRyy0lfuGq3RNSdn3zq512CUryaI5X579jz8flaiVePLcAJjOf0osVN6oWRD0=',
  '{view,edit}',
  true,
  true
)
