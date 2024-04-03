import {
  getContent,
  addContent,
  updateContent,
  CategoryType,
  ContentType,
  NationType
} from 'api/content';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { ContentQueryKeys } from 'api/enums';
import {
  AddContentRequest,
  UpdateContent
} from '@cubeca/cube-svc-client-oas-axios';

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
    mutate,
    data: response
  } = useMutation(addContent);

  const handleAddContent = async (
    payload: AddContentRequest,
    coverImageFile: File,
    mediaFile: File,
    vttFile: File,
    bannerImageFile?: File
  ) =>
    await mutate({
      payload,
      coverImageFile,
      mediaFile,
      vttFile,
      bannerImageFile
    });

  const {
    isError: isUpdateError,
    isLoading: isUpdateLoading,
    isSuccess: isUpdateSuccess,
    mutate: mutateUpdate,
    data: updateResponse
  } = useMutation(updateContent);

  const handleUpdateContent = async (
    id: string,
    payload: UpdateContent,
    coverImageFile: File,
    // vttFile: File,
    bannerImageFile: File
  ) =>
    await mutateUpdate({
      id,
      payload,
      coverImageFile,
      // vttFile,
      bannerImageFile
    });

  return {
    isLoading,
    isError,
    isUploadLoading,
    isUploadError,
    isUploadSuccess,
    isUpdateLoading,
    isUpdateError,
    isUpdateSuccess,
    response,
    updateResponse,
    data,
    addContent: handleAddContent,
    updateContent: handleUpdateContent
  };
};

export default useContent;
