import { AuthApi } from '@cubeca/bff-auth-client-oas-axios';
import {
  Configuration,
  ContentApi,
  ContentFilesApi,
  ProfileApi
} from '@cubeca/bff-client-oas-axios';
export type {
  AddContent,
  ProfileMainSchema
} from '@cubeca/bff-client-oas-axios';

import {
  PROFILE_SERVICE_URL,
  AUTH_SERVICE_URL,
  CLOUDFLARE_SERVICE_URL,
  CONTENT_SERVICE_URL
} from './settings';
import { getAuthToken } from '../utils/auth';

// `tus-js-client` expects to talk to this endpoint directly instead of going through our API client lib.
export const UPLOAD_TUS_ENDPOINT = `${CLOUDFLARE_SERVICE_URL}/upload/video-tus-reservation`;

const authConfiguration = new Configuration({
  basePath: AUTH_SERVICE_URL,
  accessToken: async () => String(await getAuthToken())
});

export const authApi = new AuthApi(authConfiguration);

const profileConfiguration = new Configuration({
  basePath: PROFILE_SERVICE_URL,
  accessToken: async () => String(await getAuthToken())
});

export const profileApi = new ProfileApi(profileConfiguration);

const contentConfiguration = new Configuration({
  basePath: CONTENT_SERVICE_URL,
  accessToken: async () => String(await getAuthToken())
});

export const contentApi = new ContentApi(contentConfiguration);

const contentFilesConfiguration = new Configuration({
  basePath: CLOUDFLARE_SERVICE_URL,
  accessToken: async () => String(await getAuthToken())
});
export const filesApi = new ContentFilesApi(contentFilesConfiguration);
