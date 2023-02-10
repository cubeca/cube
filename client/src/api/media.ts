import { MediaPayload, MediaAPIResponse } from 'types/media';
import { MEDIA_API_PATH } from './constants';
import httpClient from './httpClient';

export const addMedia = (payload: MediaPayload) =>
  httpClient.post<MediaAPIResponse>(`${MEDIA_API_PATH}`, payload);
