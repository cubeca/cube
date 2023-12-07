import { getContentDetails } from 'api/content';
import { useQuery, QueryFunctionContext } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { ContentStorage } from '@cubeca/bff-client-oas-axios';

interface ContentDetailsResponse {
  isLoading: boolean;
  isError: boolean;
  data?: ContentStorage;
}
interface ExtendedContentDetailsResponse extends ContentDetailsResponse {
  data?: ContentStorage & {
    bannerImageUrl?: {
      playerInfo?: {
        publicUrl?: string;
      };
    };
    collaboratorDetails?: {
      logoUrl?: string;
      organization?: string;
      tag?: string;
    }[];
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
    vttFileUrl?: {
      playerInfo?: {
        publicUrl?: string;
      };
    };
  };
  refetch: (context?: QueryFunctionContext) => Promise<void>;
}

const useContentDetails = (): ExtendedContentDetailsResponse => {
  const { id } = useParams();

  const { isLoading, isError, data, refetch } = useQuery(
    ['content-details', id],
    () => getContentDetails(id ?? ''),
    { enabled: !!id, refetchOnMount: true, staleTime: 0 }
  );

  return {
    isLoading,
    isError,
    data: data?.data as unknown as ContentStorage,
    refetch
  } as unknown as ExtendedContentDetailsResponse;
};

export default useContentDetails;
