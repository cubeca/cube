import { useMutation } from '@tanstack/react-query';
import { addMedia } from 'api/media';
import { MediaPayload } from 'types/media';

const useMedia = () => {
  const { isError, isLoading, isSuccess, mutate } = useMutation(addMedia);

  const handleAddMedia = (payload: MediaPayload) => mutate(payload);

  return {
    addMedia: handleAddMedia,
    isError,
    isLoading,
    isSuccess
  };
};

export default useMedia;
