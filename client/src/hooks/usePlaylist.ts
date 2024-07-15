/**
 * `usePlaylist` is a custom React hook for managing playlist-related operations for a specific profile and user. It provides
 * functionalities such as fetching all playlists, fetching a specific playlist, adding, updating, and deleting playlists, as well as
 * adding and removing content to/from playlists.
 *
 * The hook integrates with a playlist API through imported functions (`getPlaylists`, `addPlaylist`, `deletePlaylist`, `getPlaylist`,
 * `updatePlaylist`, `addContentToPlaylist`, `removeContentFromPlaylist`) to perform these operations.
 *
 * @param {string} profileId - The profile ID associated with the playlists.
 * @param {string} userId - The user ID associated with the playlists.
 * @returns {Object} An object containing:
 *   - `isLoading`: A boolean indicating if the playlist(s) fetching is in progress.
 *   - `isError`: A boolean indicating if an error occurred during the fetching.
 *   - `playlists`: The data for all fetched playlists.
 *   - `playlist`: The data for a specific fetched playlist.
 *   - `refetchPlaylists`: A function to refetch all playlists.
 *   - `refetchPlaylist`: A function to refetch a specific playlist.
 */

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
  UpdatePlaylistResponse
} from '@cubeca/cube-svc-client-oas-axios';

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
