import { getContentDetails } from 'api/content';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { ContentStorage } from '@cubeca/bff-client-oas-axios';

interface ContentDetailsResponse {
  isLoading: boolean;
  isError: boolean;
  data?: ContentStorage;
}
interface ExtendedContentDetailsResponse extends ContentDetailsResponse {
  data?: ContentStorage & {
    createdAt?: string;
    coverImageUrl?: {
      playerInfo?: {
        publicUrl?: string;
        hlsUrl?: string;
      };
    };
    mediaUrl?: {
      playerInfo?: {
        publicUrl?: string;
        hlsUrl?: string;
      };
    };
  };
}
const useContentDetails = (): ExtendedContentDetailsResponse => {
  const { id } = useParams();

  const { isLoading, isError, data } = useQuery(
    ['content-details', id],
    () => getContentDetails(id ?? ''),
    { enabled: !!id }
  );

  return {
    isLoading,
    isError,
    data: data?.data as unknown as ContentStorage
  };
};

export default useContentDetails;
