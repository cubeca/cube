import { getVideoDetails } from 'api/videos';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

const useVideoDetails = () => {
  const { id } = useParams();

  const { isLoading, isError, data } = useQuery(
    ['video-details', id],
    () => getVideoDetails(id ?? ''),
    { enabled: !!id }
  );

  return {
    isLoading,
    isError,
    data: data?.data.data
  };
};

export default useVideoDetails;
