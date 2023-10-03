import {
  Configuration,
  AuthApi,
  ContentApi,
  ProfileApi,
  UploadApi,
  FilesApi
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

const createApiInstance = async (ApiClass: any) => {
  const configuration = new Configuration({
    basePath: BFF_URL,
    accessToken: async () => String(await getAuthToken())
  });
  return new ApiClass(configuration);
};

export const authApi = createApiInstance(AuthApi);
export const profileApi = createApiInstance(ProfileApi);
export const contentApi = createApiInstance(ContentApi);
export const uploadApi = createApiInstance(UploadApi);
export const filesApi = createApiInstance(FilesApi);
