import { useQuery } from '@tanstack/react-query';
import { getFileDetails } from 'api/files';

const useContentFile = (fileId: string) => {
  const { isLoading, isError, data } = useQuery(
    ['content-file', fileId],
    () => getFileDetails(fileId),
    { keepPreviousData: false, enabled: !!fileId }
  );
  return {
    data: data?.data,
    isLoading,
    isError
  };
};

export default useContentFile;
