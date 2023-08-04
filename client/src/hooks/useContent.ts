import {
  getContent,
  addContent,
  CategoryType,
  ContentType,
  NationType
} from 'api/content';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { ContentQueryKeys } from 'api/enums';

const useContent = (list = 'videos', category?: string) => {
  const [searchParams] = useSearchParams();

  if (category) {
    searchParams.set(ContentQueryKeys.Category, category);
  }

  const _category = category ?? searchParams.get(ContentQueryKeys.Category);
  const contentType = searchParams.get(ContentQueryKeys.Type);
  const nation = searchParams.get(ContentQueryKeys.Nation);
  const creator = searchParams.get(ContentQueryKeys.Creator) ?? undefined;

  const { isLoading, isError, data } = useQuery(
    [list, _category],
    () =>
      getContent(
        category as CategoryType,
        contentType as ContentType,
        nation as NationType,
        creator
      ),
    { keepPreviousData: true }
  );

  const {
    isError: isUploadError,
    isLoading: isUploadLoading,
    isSuccess: isUploadSuccess,
    mutate
  } = useMutation(addContent);

  const handleAddContent = (
    payload: any,
    coverImageFile: File,
    mediaFile: File
  ) =>
    mutate({
      payload,
      coverImageFile,
      mediaFile
    });

  return {
    isLoading,
    isError,
    isUploadLoading,
    isUploadError,
    isUploadSuccess,
    data: undefined, // data?.data.data,
    addContent: handleAddContent
  };
};

export default useContent;
