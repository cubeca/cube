import {
  Configuration,
  AuthApi,
  ContentApi,
  ProfileApi,
  UploadApi,
  FilesApi
} from '@cubeca/bff-client-oas-axios';

import {
  CLOUDFLARE_SERVICE_URL,
  BFF_URL
} from './settings';
import { getAuthToken } from '../utils/auth';

// `tus-js-client` expects to talk to this endpoint directly instead of going through our API client lib.
export const UPLOAD_TUS_ENDPOINT = `${CLOUDFLARE_SERVICE_URL}/upload/video-tus-reservation`;

export const getUploadTusEndpoint = async (fileId: string): Promise<string> => {
  const url = new URL(UPLOAD_TUS_ENDPOINT);
  url.searchParams.set('fileId', fileId);
  url.searchParams.set('authorization', (await getAuthToken()) || '');
  return url.toString();
};

const authConfiguration = new Configuration({
  basePath: BFF_URL,
  accessToken: async () => String(await getAuthToken())
});

export const authApi = new AuthApi(authConfiguration);

const profileConfiguration = new Configuration({
  basePath: BFF_URL,
  accessToken: async () => String(await getAuthToken())
});

export const profileApi = new ProfileApi(profileConfiguration);

const contentConfiguration = new Configuration({
  basePath: BFF_URL,
  accessToken: async () => String(await getAuthToken())
});

export const contentApi = new ContentApi(contentConfiguration);

const uploadConfiguration = new Configuration({
  basePath: BFF_URL,
  accessToken: async () => String(await getAuthToken())
});

export const uploadApi = new UploadApi(uploadConfiguration);
export const filesApi = new FilesApi(uploadConfiguration);
