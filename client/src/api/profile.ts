import { ProfileAPIResponse } from 'types/profile';
import { PROFILE_API_PATH } from './settings';
import { profileApi } from '.';
import { blobToBase64 } from './helpers';
import { getAuthToken } from '../utils/auth';
import { upload } from './upload';

export type { BFFDataForProfilePageData as Profile } from '.';

export const getProfile = async (id: string) => {
  return await profileApi.profileDetails(id);
};

export const updateProfileSection = async (
  id: string,
  organization: string,
  description: string
) => {
  return await profileApi.updateProfile(id, {
    organization,
    description
  });
};

export const updateProfileLogo = async (id: string, file: File) => {
  const logoFileId = await upload(file, id);
  return await profileApi.updateProfile(id, {
    logoFileId
  });
};

export const updateProfileHero = async (id: string, file: File) => {
  const heroFileId = await upload(file, id);
  return await profileApi.updateProfile(id, {
    heroFileId
  });
};

export const updateProfileAudioDescription = async (id: string, file: File) => {
  const descriptionAudioFileId = await upload(file, id);
  return await profileApi.updateProfile(id, {
    descriptionAudioFileId
  });
};
