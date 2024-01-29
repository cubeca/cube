import { getContentByProfileId } from 'api/content';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { ContentStorage } from '@cubeca/cube-svc-client-oas-axios';

interface ContentDetailsResponse {
  isLoading: boolean;
  isError: boolean;
  data?: ContentStorage;
}
const useContentDetails = (profileId: string): ContentDetailsResponse => {
  const { isLoading, isError, data } = useQuery(
    ['profile', profileId],
    () => getContentByProfileId(profileId ?? ''),
    { enabled: !!profileId }
  );

  return {
    isLoading,
    isError,
    data: data?.data as unknown as ContentStorage
  };
};

export default useContentDetails;
