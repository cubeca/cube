import { ProfileAPIResponse } from 'types/profile';
import { PROFILE_API_PATH } from './constants';
import httpClient, { profileApi } from './httpClient';
import { blobToBase64 } from './helpers';
import { getAuthToken } from '../utils/auth';

export type { ProfileMainSchema as Profile } from './httpClient';

export const getProfile = async (id: string) => {
  return await profileApi.profileDetails(id);
};

export const updateProfileSection = async (
  id: string,
  name: string,
  description: string
) => {
  return await profileApi.profileSectionUpdate(
    id,
    {
      name,
      description
    }
  );
};

export const updateProfileLogo = async (id: string, file: File) => {
  const fileContents = (await blobToBase64(file)) as string;
  return await profileApi.profileLogoUpdate(
    id,
    {
      name: file.name,
      file_contents_base64: fileContents
    }
  );
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
        authorization: `Bearer ${await getAuthToken()}`
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
        authorization: `Bearer ${await getAuthToken()}`
      }
    }
  );
};
