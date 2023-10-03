import {
  Configuration,
  AuthApi,
  ContentApi,
  ProfileApi,
  UploadApi,
  FilesApi,
  BffApi
} from '@cubeca/bff-client-oas-axios';

import { BFF_URL } from './settings';
import { getAuthToken } from '../utils/auth';

// `tus-js-client` expects to talk to this endpoint directly instead of going through our API client lib.
export const UPLOAD_TUS_ENDPOINT = `${BFF_URL}/upload/video-tus-reservation`;

export const getUploadTusEndpoint = async (fileId: string): Promise<string> => {
  const url = new URL(UPLOAD_TUS_ENDPOINT);
  url.searchParams.set('fileId', fileId);
  url.searchParams.set('authorization', (await getAuthToken()) || '');
  return url.toString();
};

const createConfiguration = () =>
  new Configuration({
    basePath: BFF_URL,
    accessToken: async () => String(await getAuthToken())
  });

const authConfiguration = createConfiguration();
export const authApi = new AuthApi(authConfiguration);

const profileConfiguration = createConfiguration();
export const profileApi = new ProfileApi(profileConfiguration);

const contentConfiguration = createConfiguration();
export const contentApi = new ContentApi(contentConfiguration);

const uploadConfiguration = createConfiguration();
export const uploadApi = new UploadApi(uploadConfiguration);

const filesConfiguration = createConfiguration();
export const filesApi = new FilesApi(filesConfiguration);

const bffConfiguration = createConfiguration();
export const bffApi = new BffApi(bffConfiguration);
