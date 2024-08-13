import axios from 'axios';
import * as settings from '../settings';
import { makeCloudflareTusUploadMetadata } from '../utils/utils';

const CLOUDFLARE_STREAM_BASE_URL = `https://api.cloudflare.com/client/v4/accounts/${settings.CLOUDFLARE_ACCOUNT_ID}/stream`;

const cloudflareApi = axios.create({
  baseURL: CLOUDFLARE_STREAM_BASE_URL,
  timeout: 10 * 60 * 1000,
  validateStatus: null
});

/**
 * Interface representing HTTP headers.
 */
export interface Headers {
  [k: string]: string;
}

const authHeader: Headers = {
  Authorization: `bearer ${settings.CLOUDFLARE_API_TOKEN}`
};

/**
 * Get a TUS upload URL for uploading a video to Cloudflare Stream.
 *
 * @function
 * @name getTusUploadUrl
 * @param {string} fileId - The ID of the file to be uploaded.
 * @param {number} fileSizeBytes - The size of the file in bytes.
 * @param {number} reserveDurationSeconds - The duration in seconds to reserve the upload.
 * @param {number} urlValidDurationSeconds - The duration in seconds for which the URL is valid.
 * @param {string} userId - The ID of the user uploading the file.
 * @returns {Promise<{tusUploadUrl: string, cloudflareStreamUid: string}>} The TUS upload URL and Cloudflare Stream UID.
 */
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

/**
 * Delete a video from Cloudflare Stream.
 *
 * @function
 * @name deleteVideo
 * @param {string} cloudflareStreamUid - The Cloudflare Stream UID of the video to delete.
 * @returns {Promise<boolean>} True if the video was deleted successfully, false otherwise.
 */
export const deleteVideo = async (cloudflareStreamUid: string) => {
  const { status } = await cloudflareApi.delete(`/${cloudflareStreamUid}`, { headers: authHeader });
  return status === 204;
};

/**
 * Get details of a video from Cloudflare Stream.
 *
 * @function
 * @name getVideoDetails
 * @param {string} cloudflareStreamUid - The Cloudflare Stream UID of the video.
 * @returns {Promise<any|null>} The video details if the request was successful, null otherwise.
 */
export const getVideoDetails = async (cloudflareStreamUid: string) => {
  const { status, data } = await cloudflareApi.get(`/${cloudflareStreamUid}`, { headers: authHeader });
  if (status === 200) {
    return data.result;
  } else {
    return null;
  }
};
