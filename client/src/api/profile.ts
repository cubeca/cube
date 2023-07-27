import { profileApi } from '.';
import { upload } from './upload';

export const getProfile = async (id: string) => {
  return await profileApi.getProfile(id);
};

export const updateProfileSection = async (
  id: string,
  organization: string,
  website: string,
  description: string,
  budget: string
) =>
  await profileApi.updateProfile(id, {
    organization,
    website,
    description,
    budget
  });

export const updateProfileLogo = async (id: string, file: File) => {
  const logoFileId = await upload(file, id);
  return await profileApi.updateProfile(id, {
    logoUrl: logoFileId
  });
};

export const updateProfileHero = async (id: string, file: File) => {
  const heroFileId = await upload(file, id);
  return await profileApi.updateProfile(id, {
    heroUrl: heroFileId
  });
};

export const updateProfileAudioDescription = async (id: string, file: File) => {
  const descriptionAudioFileId = await upload(file, id);
  return await profileApi.updateProfile(id, {
    descriptionUrl: descriptionAudioFileId
  });
};
