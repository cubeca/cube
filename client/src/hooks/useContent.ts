import {
  getContent,
  addContent,
  CategoryType,
  ContentType,
  NationType,
  AddContent
} from 'api/content';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { ContentQueryKeys } from 'api/enums';

interface UseContentParams {
  listName?: string;
  category?: string;
  creatorId?: string;
}

const useContent = ({
  listName = 'default',
  category,
  creatorId
}: UseContentParams) => {
  const [searchParams] = useSearchParams();

  if (category) {
    searchParams.set(ContentQueryKeys.Category, category);
  }

  const _category = category ?? searchParams.get(ContentQueryKeys.Category);
  const contentType = searchParams.get(ContentQueryKeys.Type);
  const nation = searchParams.get(ContentQueryKeys.Nation);
  const creator =
    (searchParams.get(ContentQueryKeys.Creator) || creatorId) ?? undefined;

  const { isLoading, isError, data } = useQuery(
    [listName, _category],
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
    payload: Omit<AddContent, 'coverImageFileId' | 'mediaFileId'>,
    coverImageFile: File,
    mediaFile: File,
    transcriptFile: File,
    subtitlesFile: File
  ) =>
    mutate({
      payload,
      coverImageFile,
      mediaFile,
      transcriptFile,
      subtitlesFile
    });

  return {
    isLoading,
    isError,
    isUploadLoading,
    isUploadError,
    isUploadSuccess,
    data: data?.data,
    addContent: handleAddContent
  };
};

export default useContent;
