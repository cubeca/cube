import axios from 'axios';
import * as settings from '../settings';
import { makeCloudflareTusUploadMetadata } from '../utils/utils';

const CLOUDFLARE_STREAM_BASE_URL = `https://api.cloudflare.com/client/v4/accounts/${settings.CLOUDFLARE_ACCOUNT_ID}/stream`;

const cloudflareApi = axios.create({
  baseURL: CLOUDFLARE_STREAM_BASE_URL,
  timeout: 10 * 60 * 1000,
  validateStatus: null
});

export interface Headers {
  [k: string]: string;
}

const authHeader: Headers = {
  Authorization: `bearer ${settings.CLOUDFLARE_API_TOKEN}`
};

export const getTusUploadUrl = async (
  fileId: string,
  fileSizeBytes: number,
  reserveDurationSeconds: number,
  urlValidDurationSeconds: number,
  userId: string
) => {
  const requestHeaders: Headers = {
    ...authHeader,
    'Tus-Resumable': '1.0.0',
    'Upload-Creator': `file:${fileId}`,
    'Upload-Length': String(fileSizeBytes),
    'Upload-Metadata': makeCloudflareTusUploadMetadata({
      reserveDurationSeconds,
      isPrivate: false,
      urlValidDurationSeconds,
      uploadingUserId: userId
    })
  };

  const response = await cloudflareApi.post(`?direct_user=true`, null, { headers: requestHeaders });
  const tusUploadUrl = response.headers['location'];
  const cloudflareStreamUid = response.headers['stream-media-id'];

  return { tusUploadUrl, cloudflareStreamUid };
};

export const deleteVideo = async (cloudflareStreamUid: string) => {
  const { status } = await cloudflareApi.delete(`/${cloudflareStreamUid}`, { headers: authHeader });
  return status === 204;
};

export const getVideoDetails = async (cloudflareStreamUid: string) => {
  const { status, data } = await cloudflareApi.get(`/${cloudflareStreamUid}`, { headers: authHeader });
  if (status === 200) {
    return data.result;
  } else {
    return null;
  }
};
