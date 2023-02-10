import { getVideos } from 'api/videos';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { VideosQueryKeys } from 'api/enums';

const useVideos = (list = 'videos', category?: string) => {
  const [searchParams] = useSearchParams();

  if (category) {
    searchParams.set(VideosQueryKeys.Category, category);
  }

  const _category = category ?? searchParams.get(VideosQueryKeys.Category);

  const { isLoading, isError, data } = useQuery(
    [list, _category],
    () => getVideos(searchParams),
    { keepPreviousData: true }
  );

  return {
    isLoading,
    isError,
    data: data?.data.data
  };
};

export default useVideos;
