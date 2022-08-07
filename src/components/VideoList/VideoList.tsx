import { Stack, Typography } from '@mui/material';
import VideoCard from 'components/VideoCard/VideoCard';
import { FC } from 'react';
import { Video } from 'types/media';

interface VideoListProps {
  videos: Video[];
  heading?: string;
}

const VideoList: FC<VideoListProps> = ({ heading, videos }) => {
  return (
    <Stack>
      {heading && (
        <Typography pb="2rem" pt="1.5rem">
          {heading}
        </Typography>
      )}
      <Stack direction="row" spacing={2}>
        {videos.map((video) => (
          <VideoCard
            key={video.id}
            image={video.thumbnailUrl}
            title={video.title}
            creator={video.creator}
            url={video.url}
            icon={video.iconUrl}
          />
        ))}
      </Stack>
    </Stack>
  );
};

export default VideoList;
