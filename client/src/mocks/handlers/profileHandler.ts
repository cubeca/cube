import { PROFILE_API_PATH } from 'api/constants';
import { RequestHandler, rest } from 'msw';
import { ProfileAPIResponse } from 'types/profile';

import * as ProfileResolver from '../resolvers/profileResolver';

export const fetchProfile = (): RequestHandler => {
  const path = `${PROFILE_API_PATH}/:id`;
  return rest.get<ProfileAPIResponse>(path, ProfileResolver.getProfile);
};

export const updateProfileSection = (): RequestHandler => {
  const path = `${PROFILE_API_PATH}/:id`;
  return rest.put<ProfileAPIResponse>(
    path,
    ProfileResolver.updateProfileSection
  );
};

export const updateProfileLogo = (): RequestHandler => {
  const path = `${PROFILE_API_PATH}/:id/update-logo`;
  return rest.post<ProfileAPIResponse>(path, ProfileResolver.updateProfileLogo);
};
