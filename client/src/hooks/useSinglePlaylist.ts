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
