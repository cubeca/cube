CREATE TYPE file_storage_type AS ENUM ('cloudflareStream', 'cloudflareR2');
CREATE TABLE files (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    storage_type file_storage_type NOT NULL,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- An automated `updated_at` would need a trigger, which would need `CREATE
    -- LANGUAGE plpgsql;`, etc.
    -- See https://stackoverflow.com/questions/1035980/update-timestamp-when-row-is-updated-in-postgresql
    -- For now, not automated at SQL level.
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    data JSONB NOT NULL DEFAULT '{}'::JSONB
);
