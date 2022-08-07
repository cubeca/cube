import { ProfileAPIResponse } from 'types/profile';
import { PROFILE_API_PATH } from './constants';
import httpClient from './httpClient';

export const getProfile = (id: string) =>
  httpClient.get<ProfileAPIResponse>(`${PROFILE_API_PATH}/${id}`);
