import { CONTENT_API_PATH } from 'api/constants';
import { RequestHandler, rest } from 'msw';
import {
  ContentListAPIResponse,
  ContentDetailsAPIResponse
} from 'types/content';
import { ProfileAPIResponse } from 'types/profile';

import * as ContentResolver from '../resolvers/contentResolver';

export const fetchFeatured = (): RequestHandler =>
  rest.get<ContentListAPIResponse>(
    CONTENT_API_PATH,
    ContentResolver.getFeatured
  );

export const fetchContentDetails = (): RequestHandler => {
  const path = `${CONTENT_API_PATH}/:id`;
  return rest.get<ContentDetailsAPIResponse>(path, ContentResolver.getSingle);
};

export const addContent = (): RequestHandler => {
  return rest.post<ProfileAPIResponse>(
    CONTENT_API_PATH,
    ContentResolver.addContent
  );
};
