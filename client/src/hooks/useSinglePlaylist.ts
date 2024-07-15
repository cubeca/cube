/**
 * `useSinglePlaylist` is a custom React hook to fetch and manage a single playlist by its ID.
 * The query uses the `getPlaylist` function from the `api/playlist` module, passing the `playlistId` to fetch the 
 * specific playlist data.

 * It exposes the fetched playlist data (`playlist`), a loading state (`isLoading`), a success state (`isSuccess`), and a 
 * `refetchPlaylist` function that can be called to manually trigger the fetching of the playlist. Additionally, it provides a 
 * `handleGetPlaylist` function as a convenient method to trigger the refetch and return the playlist data.

 * @param {string} playlistId - The unique identifier of the playlist to be fetched.
 * @returns {Object} An object containing:
 *   - `playlist`: The fetched playlist data or `undefined` if not yet fetched.
 *   - `handleGetPlaylist`: A function to manually trigger the fetching of the playlist data.
 *   - `isLoading`: A boolean indicating if the playlist data is currently being fetched.
 *   - `isSuccess`: A boolean indicating if the last fetch operation was successful.
 *   - `refetchPlaylist`: A function provided by `useQuery` to manually refetch the playlist data.
 */

import { getPlaylist } from 'api/playlist';
import { useQuery } from '@tanstack/react-query';

const useSinglePlaylist = (playlistId: string) => {
  const {
    data: playlist,
    refetch: refetchPlaylist,
    isLoading,
    isSuccess
  } = useQuery(['playlist', playlistId], () => getPlaylist(playlistId), {
    enabled: false
  });

  const handleGetPlaylist = async () => {
    await refetchPlaylist();
    return playlist;
  };

  return { playlist, handleGetPlaylist, isLoading, isSuccess, refetchPlaylist };
};

export default useSinglePlaylist;
