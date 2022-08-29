import { MEDIA_API_PATH } from 'api/constants';
import { RequestHandler, rest } from 'msw';
import { ProfileAPIResponse } from 'types/profile';

import * as MediaResolver from '../resolvers/mediaResolver';

export const addMedia = (): RequestHandler => {
  return rest.post<ProfileAPIResponse>(MEDIA_API_PATH, MediaResolver.addMedia);
};
