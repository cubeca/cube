import { Stack } from '@mui/material';
import VideoCard from 'components/VideoCard';

import useVideos from 'hooks/useVideos';
import { Video } from 'types/media';
import { VideosLoader } from 'components/Loaders';
import FeaturedVideosFilter from './FeaturedVideosFilter';
import { VideoLists } from 'types/enums';

const FeaturedVideos = () => {
  const { data, isLoading } = useVideos('featured', VideoLists.Featured);

  const videos = data?.videos ?? [];

  return (
    <>
      <FeaturedVideosFilter />
      <Stack direction="row" spacing={6} py="4rem">
        {!isLoading ? (
          videos.map((video: Video) => (
            <VideoCard
              key={video.id}
              image={video.thumbnailUrl}
              title={video.title}
              creator={video.creator}
              url={video.url}
              icon={video.iconUrl}
            />
          ))
        ) : (
          <VideosLoader size={6} />
        )}
      </Stack>
    </>
  );
};

export default FeaturedVideos;
