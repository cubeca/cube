import { getContent, addContent } from 'api/content';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { ContentQueryKeys } from 'api/enums';
import { ContentPayload } from 'types/content';

const useContent = (list = 'videos', category?: string) => {
  const [searchParams] = useSearchParams();

  if (category) {
    searchParams.set(ContentQueryKeys.Category, category);
  }

  const _category = category ?? searchParams.get(ContentQueryKeys.Category);

  const { isLoading, isError, data } = useQuery(
    [list, _category],
    () => getContent(searchParams),
    { keepPreviousData: true }
  );

  const {
    isError: isUploadError,
    isLoading: isUploadLoading,
    isSuccess: isUploadSuccess,
    mutate
  } = useMutation(addContent);

  const handleAddContent = (payload: ContentPayload) => mutate(payload);

  return {
    isLoading,
    isError,
    isUploadLoading,
    isUploadError,
    isUploadSuccess,
    data: data?.data.data,
    addContent: handleAddContent
  };
};

export default useContent;
