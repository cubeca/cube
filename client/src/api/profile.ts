import { ProfileAPIResponse } from 'types/profile';
import { PROFILE_API_PATH } from './constants';
import httpClient, { profileApi } from './httpClient';
import { blobToBase64 } from './helpers';
import { getAuthToken } from 'utils/authToken';

export type { ProfileMainSchema as Profile } from './httpClient';

export const getProfile = async (id: string) => {
  const profileDetailsApi = await profileApi.profileDetails(id, {
    headers: {
      authorization: `BEARER ${getAuthToken()}`
    }
  });
  return await profileDetailsApi();
};

export const updateProfileSection = async (
  id: string,
  name: string,
  description: string
) => {
  const profileSectionApi = await profileApi.profileSectionUpdate(
    id,
    {
      name,
      description
    },
    {
      headers: {
        authorization: `BEARER ${getAuthToken()}`
      }
    }
  );
  return await profileSectionApi();
};

export const updateProfileLogo = async (id: string, file: File) => {
  const fileContents = (await blobToBase64(file)) as string;
  const updateProfileLogoApi = await profileApi.profileLogoUpdate(
    id,
    {
      name: file.name,
      file_contents_base64: fileContents
    },
    {
      headers: {
        authorization: `BEARER ${getAuthToken()}`
      }
    }
  );
  return updateProfileLogoApi();
};

export const updateProfileHero = async (id: string, file: File) => {
  const fileContents = await blobToBase64(file);
  return httpClient.post<ProfileAPIResponse>(
    `${PROFILE_API_PATH}/${id}/update-hero`,
    {
      name: file.name,
      file_contents_base64: fileContents
    },
    {
      headers: {
        authorization: `BEARER ${getAuthToken()}`
      }
    }
  );
};

export const updateProfileAudioDescription = async (id: string, file: File) => {
  const fileContents = await blobToBase64(file);
  return httpClient.post<ProfileAPIResponse>(
    `${PROFILE_API_PATH}/${id}/update-audio-description`,
    {
      name: file.name,
      file_contents_base64: fileContents
    },
    {
      headers: {
        authorization: `BEARER ${getAuthToken()}`
      }
    }
  );
};
