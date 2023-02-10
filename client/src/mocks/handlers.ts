import * as VideosHandler from './handlers/videosHandler';
import * as ProfileHandler from './handlers/profileHandler';
import * as MediaHandler from './handlers/mediaHandler';
import * as CollaboratorsHandler from './handlers/collaboratorsHandler';

export const handlers = [
  VideosHandler.fetchFeatured(),
  VideosHandler.fetchVideoDetails(),
  ProfileHandler.fetchProfile(),
  ProfileHandler.updateProfileSection(),
  ProfileHandler.updateProfileLogo(),
  MediaHandler.addMedia(),
  CollaboratorsHandler.fetchCollaborators()
];
