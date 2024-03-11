import { getContentDetails } from 'api/content';
import { useQuery, QueryFunctionContext } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { ContentStorage } from '@cubeca/cube-svc-client-oas-axios';
import { queryClient } from 'providers/QueryProvider/QueryProvider';

interface ContentDetailsResponse {
  isLoading: boolean;
  isError: boolean;
  data?: ContentStorage;
  fetchContentDetails: (id: string) => Promise<ContentStorage>;
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

  const fetchContentDetails = async (id: string) => {
    const response = await queryClient.fetchQuery(['content-details', id], () =>
      getContentDetails(id)
    );
    return response.data as unknown as ContentStorage; // Extract data from response
  };

  return {
    isLoading,
    isError,
    data: data?.data as unknown as ContentStorage,
    refetch,
    fetchContentDetails
  } as unknown as ExtendedContentDetailsResponse;
};

export default useContentDetails;
