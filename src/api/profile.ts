import { ProfileAPIResponse } from 'types/profile';
import { PROFILE_API_PATH } from './constants';
import httpClient from './httpClient';
import { blobToBase64 } from './helpers';

export const getProfile = (id: string) =>
  httpClient.get<ProfileAPIResponse>(`${PROFILE_API_PATH}/${id}`);

export const updateProfileSection = (
  id: string,
  name: string,
  description: string
) =>
  httpClient.put<ProfileAPIResponse>(`${PROFILE_API_PATH}/${id}`, {
    name,
    description
  });

export const updateProfileLogo = async (id: string, file: File) => {
  const fileContents = await blobToBase64(file);
  return httpClient.post<ProfileAPIResponse>(
    `${PROFILE_API_PATH}/${id}/update-logo`,
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
    }
  );
};
