import {
  getPlaylists,
  addPlaylist,
  deletePlaylist,
  getPlaylist,
  updatePlaylist,
  addContentToPlaylist,
  removeContentFromPlaylist
} from 'api/playlist';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  AddContentToPlaylistRequest,
  AddPlaylistRequest,
  AddPlaylistResponse,
  GetPlaylistByIdResponse,
  UpdatePlaylistResponse
} from '@cubeca/cube-svc-client-oas-axios';
import { useState } from 'react';
import { add } from 'date-fns';

const usePlaylist = (profileId: string, userId: string) => {
  const {
    isLoading,
    isError,
    data: playlists,
    refetch: refetchPlaylists
  } = useQuery(
    ['playlists', profileId, userId],
    () => getPlaylists(0, 100, profileId, userId),
    { enabled: !!profileId || !!userId, keepPreviousData: true }
  );

  const { data: playlist, refetch: refetchPlaylist } = useQuery(
    ['playlist', profileId],
    () => getPlaylist(profileId),
    { enabled: false }
  );
  const [createdPlaylistId, setCreatedPlaylistId] = useState(null);

  const {
    mutate: addPlaylistMutation,
    isError: isAddError,
    isLoading: isAddLoading,
    isSuccess: isAddSuccess,
    data: addResponse
  } = useMutation(addPlaylist, {
    onSuccess: (data) => {
      refetchPlaylists();
    }
  });
  const {
    mutate: deletePlaylistMutation,
    isError: isDeleteError,
    isLoading: isDeleteLoading,
    isSuccess: isDeleteSuccess,
    data: deleteResponse
  } = useMutation(deletePlaylist);

  const handleDeletePlaylist = async (id: string) => {
    await deletePlaylistMutation(id);
    refetchPlaylists();
  };

  const handleGetPlaylist = async (id: string) => {
    await getPlaylist(id);
    refetchPlaylist();
    return playlist;
  };
  // embedPlaylistWhitelist = ['https://www.youtube.com/embed/'];

  const handleAddPlaylist = (
    payload: AddPlaylistRequest,
    playlistImageFile?: File
  ) => {
    return addPlaylistMutation({
      payload,
      playlistImageFile
    });
  };

  const handleAddContentToPlaylist = async (
    id: string,
    payload: AddContentToPlaylistRequest
  ) => {
    await addContentToPlaylist(id, payload);
    refetchPlaylist();
  };

  const handleRemoveContentFromPlaylist = async (
    id: string,
    contentId: any
  ) => {
    await removeContentFromPlaylist(id, contentId);
    refetchPlaylist();
  };

  const handleUpdatePlaylist = async (
    id: string,
    payload: UpdatePlaylistResponse
  ) => {
    await updatePlaylist(id, payload);
    refetchPlaylists();
  };

  return {
    isLoading,
    isError,
    playlists,
    playlist,
    isAddLoading,
    isAddError,
    isAddSuccess,
    addResponse,
    isDeleteLoading,
    isDeleteError,
    isDeleteSuccess,
    deleteResponse,
    addResponseData: addResponse,
    refetchPlaylists,
    addPlaylist: handleAddPlaylist,
    addContentToPlaylist: handleAddContentToPlaylist,
    removeContentFromPlaylist: handleRemoveContentFromPlaylist,
    deletePlaylist: handleDeletePlaylist,
    getPlaylist: handleGetPlaylist,
    updatePlaylist: handleUpdatePlaylist
  };
};

export default usePlaylist;
