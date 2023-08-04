CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE profiles (
    id uuid DEFAULT uuid_generate_v4 (),
    organization VARCHAR NOT NULL UNIQUE,
    website VARCHAR NOT NULL UNIQUE,
    tag VARCHAR NOT NULL UNIQUE,
    heroFileId VARCHAR DEFAULT '',
    logoFileId VARCHAR DEFAULT '',
    description VARCHAR DEFAULT '',
    descriptionFileId VARCHAR DEFAULT '',
    budget VARCHAR DEFAULT '',
    PRIMARY KEY (id)
);