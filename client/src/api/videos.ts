import { VideoDetailsAPIResponse, VideoListAPIResponse } from 'types/media';

import { VIDEOS_API_PATH } from './constants';
import { VideosQueryKeys } from './enums';
import { getRequestParams } from './helpers';
import httpClient from './httpClient';

const getVideosPath = (params?: URLSearchParams) =>
  `${VIDEOS_API_PATH}?${getRequestParams(VideosQueryKeys, params)}`;

export const getVideos = (params?: URLSearchParams) =>
  httpClient.get<VideoListAPIResponse>(getVideosPath(params));

export const getVideoDetails = (id: string) =>
  httpClient.get<VideoDetailsAPIResponse>(`${VIDEOS_API_PATH}/${id}`);
