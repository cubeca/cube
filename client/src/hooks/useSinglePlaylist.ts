import { getPlaylist } from 'api/playlist';
import { useQuery, useMutation } from '@tanstack/react-query';
import { GetPlaylistByIdResponse } from '@cubeca/cube-svc-client-oas-axios';
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

  return { playlist, handleGetPlaylist, isLoading, isSuccess };
};

export default useSinglePlaylist;
