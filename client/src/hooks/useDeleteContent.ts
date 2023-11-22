import { useMutation } from '@tanstack/react-query';
import { deleteContent as deleteContentApi } from 'api/content';

const useDeleteContent = () => {
  const { mutate, isLoading, isError } = useMutation(deleteContentApi);

  return { deleteContent: mutate, isLoading, isError };
};

export default useDeleteContent;
