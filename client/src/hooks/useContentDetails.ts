import { getContentDetails } from 'api/content';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { ContentStorage } from '@cubeca/bff-client-oas-axios';
import { useEffect } from 'react';

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
}

const useContentDetails = (): ExtendedContentDetailsResponse => {
  const { id } = useParams();
  useEffect(() => {
    console.log('ID changed:', id);
  }, [id]);
  const { isLoading, isError, data } = useQuery(
    ['content-details', id],
    () => getContentDetails(id ?? ''),
    {
      enabled: !!id,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      refetchInterval: false,
      refetchIntervalInBackground: false,
      staleTime: Infinity
    }
  );

  return {
    isLoading,
    isError,
    data: data?.data as unknown as ContentStorage
  };
};

export default useContentDetails;
