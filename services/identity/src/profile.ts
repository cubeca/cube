import axios, { AxiosHeaders } from 'axios';
import * as settings from './settings';

const profileApi = axios.create({
  baseURL: settings.PROFILE_SERVICE_URL,
  timeout: 10 * 1000,

  // Do not throw errors for non-2xx responses, that makes handling them easier.
  validateStatus: null
});

export const createDefaultProfile = async (authHeader: AxiosHeaders, organization: string, website: string, tag: string) => {
  const createProfileResponse = await profileApi.post(
    `/profiles`,
    {
      organization,
      website,
      tag
    },
    { headers: authHeader }
  );
  
  return createProfileResponse.data.id;
};
