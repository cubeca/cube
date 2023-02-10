import { VIDEOS_API_PATH } from 'api/constants';
import { RequestHandler, rest } from 'msw';
import { VideoListAPIResponse, VideoDetailsAPIResponse } from 'types/media';

import * as VideosResolver from '../resolvers/videosResolver';

export const fetchFeatured = (): RequestHandler =>
  rest.get<VideoListAPIResponse>(VIDEOS_API_PATH, VideosResolver.getFeatured);

export const fetchVideoDetails = (): RequestHandler => {
  const path = `${VIDEOS_API_PATH}/:id`;
  return rest.get<VideoDetailsAPIResponse>(path, VideosResolver.getSingle);
};
