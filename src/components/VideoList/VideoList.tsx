import { Stack, Typography } from '@mui/material';
import VideoCard, { VideoCardProps } from 'components/VideoCard/VideoCard';
import { FC } from 'react';

interface VideoListProps {
  videos: VideoCardProps[];
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
            key={video.title}
            image={video.image}
            title={video.title}
            url={video.url}
          />
        ))}
      </Stack>
    </Stack>
  );
};

export default VideoList;
