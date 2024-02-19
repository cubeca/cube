import { AddPlaylistRequest } from '@cubeca/cube-svc-client-oas-axios';
import { playlistApi } from '.';
import { upload } from './upload';

export const addPlaylist = async ({
  payload,
  playlistImageFile
}: {
  payload: AddPlaylistRequest;
  playlistImageFile?: File;
}) => {
  if (playlistImageFile) {
    const fileId = await upload(playlistImageFile, payload.profileId);
    if (fileId) {
      payload.coverImageFileId = fileId;
    }
  }
  // return await playlistApi.addPlaylist(payload);
  const response = await playlistApi.addPlaylist(payload);
  return response;
};

export const deletePlaylist = async (id: string) => {
  return await playlistApi.deletePlaylist(id);
};

export const updatePlaylist = async (id: string, payload: any) => {
  return await playlistApi.updatePlaylist(id, payload);
};

export const getPlaylists = async (
  offset: number,
  limit: number,
  profileId: string,
  userId: string
) => {
  return await playlistApi.getPlaylist(offset, limit, profileId, userId);
};

export const getPlaylist = async (id: string) => {
  return await playlistApi.getPlaylistById(id);
};
