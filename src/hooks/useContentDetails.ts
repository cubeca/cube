import { getContentDetails } from 'api/content';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

const useContentDetails = () => {
  const { id } = useParams();

  const { isLoading, isError, data } = useQuery(
    ['content-details', id],
    () => getContentDetails(id ?? ''),
    { enabled: !!id }
  );

  return {
    isLoading,
    isError,
    data: data?.data.data
  };
};

export default useContentDetails;
