/**
 * `useDeleteContent` is a custom React hook that provides functionality to delete a specific piece of content, leveraging the 
 * `deleteContentApi` function from the `api/content` module to perform the actual API call for content deletion.

 * @returns {Object} An object containing:
 *   - `deleteContent`: A function that can be called to initiate the deletion of content. It expects a content ID argument
 *   - `isLoading`: A boolean indicating if the deletion operation is currently in progress.
 *   - `isError`: A boolean indicating if an error occurred during the deletion operation.
 */

import { useMutation } from '@tanstack/react-query';
import { deleteContent as deleteContentApi } from 'api/content';

const useDeleteContent = () => {
  const { mutate, isLoading, isError } = useMutation(deleteContentApi);

  return { deleteContent: mutate, isLoading, isError };
};

export default useDeleteContent;
