import axios from 'axios';
import * as settings from './settings';

// `tus-js-client` expects to talk to this endpoint directly instead of going through our API client lib.
export const UPLOAD_TUS_ENDPOINT = `${settings.CLOUDFLARE_SERVICE_URL}/upload/video-tus-reservation`;

export const getUploadTusEndpoint = (fileId: string, authToken: string): string => {
  const url = new URL(UPLOAD_TUS_ENDPOINT);
  url.searchParams.set('fileId', fileId);
  url.searchParams.set('authorization', authToken);
  return url.toString();
};

export const identityApi = axios.create({
  baseURL: settings.IDENTITY_SERVICE_URL,
  timeout: 60 * 1000,

  // Do not throw errors for non-2xx responses, that makes testing easier.
  validateStatus: null
});

export const profileApi = axios.create({
  baseURL: settings.PROFILE_SERVICE_URL,
  timeout: 60 * 1000,

  // Do not throw errors for non-2xx responses, that makes testing easier.
  validateStatus: null
});

export const contentApi = axios.create({
  baseURL: settings.CONTENT_SERVICE_URL,
  timeout: 60 * 1000,

  // Do not throw errors for non-2xx responses, that makes testing easier.
  validateStatus: null
});

export const cloudflareApi = axios.create({
  baseURL: settings.CLOUDFLARE_SERVICE_URL,
  timeout: 60 * 1000,

  // Do not throw errors for non-2xx responses, that makes testing easier.
  validateStatus: null
});
