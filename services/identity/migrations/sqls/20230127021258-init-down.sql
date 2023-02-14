DROP TABLE IF EXISTS users;
-- -- TODO Re-enable this after figuring out if this extension has any cross-talk effects between separate microservices sharing one DB server instance (but not DBs!), which we will probably do in the beginning to save costs.
-- DROP EXTENSION IF EXISTS "uuid-ossp";