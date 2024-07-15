/**
 * `useContent` is a custom React hook designed to fetch content data using the `@tanstack/react-query` library. It integrates with 
 * the application's content API to perform operations such as getting content, adding new content, and updating existing content. 
 * The hook also utilizes `react-router-dom`'s `useSearchParams` for managing URL search parameters, allowing it to filter content 
 * based on category, content type, nation, and creator.

 * The hook accepts an optional `list` parameter, defaulting to 'videos', to specify the type of content to fetch, and an optional 
 * `category` parameter for filtering content by category. It automatically updates the URL search parameters to reflect the selected 
 * category if provided.

 * Additionally, the hook provides `isLoading`, `isError`, and `data` states to manage and access the content fetching status and 
 * results. It also supports content addition and updating through the `useMutation` hook, leveraging the `addContent` and 
 * `updateContent` functions from the content API.

 * @param {string} [list='videos'] - Optional. Specifies the type of content to fetch (e.g., 'videos', 'audio'). Defaults to 'videos'.
 * @param {string} [category] - Optional. Specifies the category to filter the content by.
 * @returns {Object} An object containing the following properties:
 *   - `isLoading`: A boolean indicating if the content fetching is in progress.
 *   - `isError`: A boolean indicating if there was an error during the content fetching.
 *   - `data`: The content data fetched from the API.
 */

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
    bannerImageFile: File
  ) =>
    await mutateUpdate({
      id,
      payload,
      coverImageFile,
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
