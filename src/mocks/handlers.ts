import * as VideosHandler from './handlers/videosHandler';
import * as ProfileHandler from './handlers/profileHandler';

export const handlers = [
  VideosHandler.fetchFeatured(),
  VideosHandler.fetchVideoDetails(),
  ProfileHandler.fetchProfile()
];
