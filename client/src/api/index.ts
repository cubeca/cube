import {
  Configuration,
  IdentityApi,
  ContentApi,
  ProfileApi,
  CloudflareApi,
  CommonApi
} from '@cubeca/cube-svc-client-oas-axios';

import { CUBE_SVC_URL } from './settings';
import { getAuthToken } from '../utils/auth';

// `tus-js-client` expects to talk to this endpoint directly instead of going through our API client lib.
export const UPLOAD_TUS_ENDPOINT = `${CUBE_SVC_URL}/upload/video-tus-reservation`;

export const getUploadTusEndpoint = async (fileId: string): Promise<string> => {
  const url = new URL(UPLOAD_TUS_ENDPOINT);
  url.searchParams.set('fileId', fileId);
  url.searchParams.set('authorization', getAuthToken() || '');
  return url.toString();
};

const createConfiguration = () =>
  new Configuration({
    basePath: CUBE_SVC_URL,
    accessToken: async () => String(getAuthToken())
  });

const authConfiguration = createConfiguration();
export const authApi = new IdentityApi(authConfiguration);

const profileConfiguration = createConfiguration();
export const profileApi = new ProfileApi(profileConfiguration);

const contentConfiguration = createConfiguration();
export const contentApi = new ContentApi(contentConfiguration);

const uploadConfiguration = createConfiguration();
export const uploadApi = new CloudflareApi(uploadConfiguration);

const filesConfiguration = createConfiguration();
export const filesApi = new CloudflareApi(filesConfiguration);

const bffConfiguration = createConfiguration();
export const bffApi = new CommonApi(bffConfiguration);
