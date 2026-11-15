export type UserRow = {
  id: string;
  name: string;
  email: string;
  password: string;
  permission_ids: string[] | null;
  is_active: boolean | null;
  has_verified_email: boolean | null;
  has_accepted_terms: boolean | null;
  has_accepted_newsletter: boolean | null;
  profile_id: string | null;
  is_over_18: boolean | null;
};

export type ProfileRow = {
  id: string;
  organization: string;
  website: string;
  tag: string;
  herofileid: string | null;
  logofileid: string | null;
  description: string | null;
  descriptionfileid: string | null;
  budget: string | null;
  status: string | null;
};

export type JsonRow = {
  id: string;
  created_at: Date | string;
  updated_at: Date | string;
  data: Record<string, unknown>;
};

export type FileRow = JsonRow & {
  storage_type: string;
};

export const USER_COLUMNS =
  'id, name, email, password, permission_ids, is_active, has_verified_email, has_accepted_terms, has_accepted_newsletter, profile_id, is_over_18';

export const PROFILE_COLUMNS =
  'id, organization, website, tag, herofileid, logofileid, description, descriptionfileid, budget, status';

export const JSON_COLUMNS = 'id, created_at, updated_at, data';

export const FILE_COLUMNS = 'id, storage_type, created_at, updated_at, data';
