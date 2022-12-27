import * as ContentHandler from './handlers/contentHandler';
import * as ProfileHandler from './handlers/profileHandler';
import * as CollaboratorsHandler from './handlers/collaboratorsHandler';

export const handlers = [
  ContentHandler.fetchFeatured(),
  ContentHandler.fetchContentDetails(),
  ContentHandler.addContent(),
  ProfileHandler.fetchProfile(),
  ProfileHandler.updateProfileSection(),
  ProfileHandler.updateProfileLogo(),
  CollaboratorsHandler.fetchCollaborators()
];
