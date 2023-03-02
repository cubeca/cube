import axios from 'axios';

import { AuthApi } from '@cubeca/bff-auth-client-oas-axios';
import {
  Configuration,
  ContentApi,
  ContentFilesApi,
  ProfileApi,
  UploadApi,
  FilesApi
} from '@cubeca/bff-client-oas-axios';
export type {
  AddContent,
  ProfileMainSchema
} from '@cubeca/bff-client-oas-axios';

import { API_URL, AUTH_SERVICE_URL } from './constants';
import { getAuthToken } from '../utils/authToken';

// `tus-js-client` expects to talk to this endpoint directly instead of going through our API client lib.
export const UPLOAD_TUS_ENDPOINT = `${API_URL}/upload/video-tus-reservation`;

const authConfiguration = new Configuration({
  basePath: AUTH_SERVICE_URL,
  accessToken: getAuthToken
});

export const authApi = new AuthApi(authConfiguration);

// Call backend requests via generated client
const configuration = new Configuration({
  basePath: API_URL,
  accessToken: getAuthToken
});

export const contentApi = new ContentApi(configuration);
export const contentFilesApi = new ContentFilesApi(configuration);
export const profileApi = new ProfileApi(configuration);
export const uploadApi = new UploadApi(configuration);
export const filesApi = new FilesApi(configuration);

// Standard http requests
const httpClient = axios.create({
  baseURL: API_URL
});

export default httpClient;
