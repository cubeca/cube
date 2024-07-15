/**
 * `useContentDetails` is a custom React hook to fetch detailed information about a specific piece of content. It leverages the 
 * `getContentDetails` function from the `api/content` module to perform the data fetching based on the content ID obtained from 
 * the URL parameters using `useParams` from `react-router-dom`. 

 * @returns {ExtendedContentDetailsResponse} An object containing the loading state (`isLoading`), error state (`isError`), 
 * detailed content data (`data`), and a method to manually fetch content details (`fetchContentDetails`). The `data` object 
 * includes extended information such as image URLs, collaborator details, and media URLs.
 */

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
