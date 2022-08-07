import { PROFILE_API_PATH } from 'api/constants';
import { RequestHandler, rest } from 'msw';
import { ProfileAPIResponse } from 'types/profile';

import * as ProfileResolver from '../resolvers/profileResolver';

export const fetchProfile = (): RequestHandler => {
  const path = `${PROFILE_API_PATH}/:id`;
  return rest.get<ProfileAPIResponse>(path, ProfileResolver.getProfile);
};
