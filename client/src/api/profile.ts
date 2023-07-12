import { profileApi } from '.';
import { upload } from './upload';

export type { BFFDataForProfilePageData as Profile } from '.';

export const getProfile = async (id: string) => {
  return await profileApi.profileDetails(id);
};

export const updateProfileSection = async (id: string, description: string) => {
  return await profileApi.updateProfile(id, {
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
