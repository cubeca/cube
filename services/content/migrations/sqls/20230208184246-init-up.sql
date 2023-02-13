CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE content (
    id uuid DEFAULT uuid_generate_v4 (),
    profile_id uuid NOT NULL,
    -- name VARCHAR NOT NULL,
    -- email VARCHAR NOT NULL UNIQUE,
    -- password VARCHAR NOT NULL,
    -- permission_ids VARCHAR ARRAY,
    -- is_active BOOLEAN DEFAULT true,
    -- has_verified_email BOOLEAN DEFAULT false,
    -- has_accepted_terms BOOLEAN DEFAULT false,
    -- has_accepted_newsletter BOOLEAN DEFAULT false,
    PRIMARY KEY (id)
);