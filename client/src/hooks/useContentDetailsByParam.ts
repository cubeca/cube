/**
 * `useContentDetailsByParam` is a custom React hook that fetches detailed information about a specific piece of content identified by 
 * URL parameters. This hook is particularly useful in scenarios where content details need to be fetched based on the current URL.

 * @returns {ExtendedContentDetailsResponse} An object containing:
 *   - `isLoading`: A boolean indicating if the content details are currently being fetched.
 *   - `isError`: A boolean indicating if an error occurred during the fetching process.
 *   - `data`: The detailed content data, optionally extended with additional fields like image URLs and collaborator details.
 *   - `fetchContentDetails`: A method for manually fetching content details by ID.
 */

import { getContentDetails } from 'api/content';
import { useQuery, QueryFunctionContext } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { ContentStorage } from '@cubeca/cube-svc-client-oas-axios';
import { queryClient } from 'providers/QueryProvider/QueryProvider';
import { useLocation } from 'react-router-dom';

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

const useContentDetailsByParam = (): ExtendedContentDetailsResponse => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('contentid');

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

export default useContentDetailsByParam;
