import { ProfileAPIResponse } from 'types/profile';
import { PROFILE_API_PATH } from './constants';
import httpClient from './httpClient';

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

export const updateProfileLogo = (id: string, file: File) => {
  const formData = new FormData();
  formData.append('profile-logo', file, file.name);
  return httpClient.post<ProfileAPIResponse>(
    `${PROFILE_API_PATH}/${id}/update-logo`,
    {
      file
    }
  );
};

export const updateProfileHero = (id: string, file: File) => {
  const formData = new FormData();
  formData.append('profile-hero', file, file.name);
  return httpClient.post<ProfileAPIResponse>(
    `${PROFILE_API_PATH}/${id}/update-hero`,
    {
      file
    }
  );
};

export const updateProfileAudioDescription = (id: string, file: File) => {
  const formData = new FormData();
  formData.append('profile-audio-description', file, file.name);
  return httpClient.post<ProfileAPIResponse>(
    `${PROFILE_API_PATH}/${id}/update-audio-description`,
    {
      file
    }
  );
};
