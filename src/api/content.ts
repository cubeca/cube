import {
  ContentAPIResponse,
  ContentDetailsAPIResponse,
  ContentListAPIResponse,
  ContentPayload
} from 'types/content';

import { CONTENT_API_PATH } from './constants';
import { ContentQueryKeys } from './enums';
import { getRequestParams } from './helpers';
import httpClient from './httpClient';

const getContentPath = (params?: URLSearchParams) =>
  `${CONTENT_API_PATH}?${getRequestParams(ContentQueryKeys, params)}`;

export const getContent = (params?: URLSearchParams) =>
  httpClient.get<ContentListAPIResponse>(getContentPath(params));

export const getContentDetails = (id: string) =>
  httpClient.get<ContentDetailsAPIResponse>(`${CONTENT_API_PATH}/${id}`);

export const addContent = (payload: ContentPayload) =>
  httpClient.post<ContentAPIResponse>(`${CONTENT_API_PATH}`, payload);
