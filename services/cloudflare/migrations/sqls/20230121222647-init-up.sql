CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE file_upload_details (
    id uuid DEFAULT uuid_generate_v4 (),
    stream_media_uuid uuid NOT NULL,
    file_owner_uuid uuid NOT NULL,
    filename VARCHAR NOT NULL,
    PRIMARY KEY (id)
);