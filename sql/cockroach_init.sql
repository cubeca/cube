-- Cloudflare
CREATE TABLE public.files (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    storage_type VARCHAR NOT NULL,
    created_at TIMESTAMPTZ NULL DEFAULT current_timestamp(),
    updated_at TIMESTAMPTZ NULL DEFAULT current_timestamp(),
    data JSONB NOT NULL DEFAULT '{}'::JSONB,
    CONSTRAINT files_pkey PRIMARY KEY (id)
);

-- Content
CREATE TABLE public.content (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NULL DEFAULT current_timestamp(),
    updated_at TIMESTAMPTZ NULL DEFAULT current_timestamp(),
    data JSONB NOT NULL DEFAULT '{}'::JSONB,
    CONSTRAINT content_pkey PRIMARY KEY (id)
);
CREATE INDEX content_by_profile_id ON public.content ((data ->> 'profileId'));

-- VTT
CREATE TABLE public.vtt (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    transcript JSONB NOT NULL DEFAULT '{}'::JSONB,
    CONSTRAINT vtt_pk PRIMARY KEY (id)
);

-- Identity
CREATE TABLE public.users (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL,
    email VARCHAR NOT NULL,
    password VARCHAR NOT NULL,
    permission_ids VARCHAR[] NULL, -- Assuming array of strings
    is_active BOOL NULL DEFAULT true,
    has_verified_email BOOL NULL DEFAULT false,
    has_accepted_terms BOOL NULL DEFAULT false,
    has_accepted_newsletter BOOL NULL DEFAULT false,
    profile_id VARCHAR NULL,
    is_over_18 BOOL NULL DEFAULT false,
    CONSTRAINT users_email_key UNIQUE (email),
    CONSTRAINT users_pkey PRIMARY KEY (id)
);

-- Profile
CREATE TABLE public.profiles (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    organization VARCHAR NOT NULL,
    website VARCHAR NOT NULL,
    tag VARCHAR NOT NULL,
    herofileid VARCHAR NULL DEFAULT ''::VARCHAR,
    logofileid VARCHAR NULL DEFAULT ''::VARCHAR,
    description VARCHAR NULL DEFAULT ''::VARCHAR,
    descriptionfileid VARCHAR NULL DEFAULT ''::VARCHAR,
    budget VARCHAR NULL DEFAULT ''::VARCHAR,
    CONSTRAINT profiles_organization_key UNIQUE (organization),
    CONSTRAINT profiles_pkey PRIMARY KEY (id),
    CONSTRAINT profiles_tag_key UNIQUE (tag),
    CONSTRAINT profiles_website_key UNIQUE (website)
);
