import { FC } from 'react';
import YouTube from 'react-youtube';

interface YouTubePlayerProps {
  id: string;
}

const YouTubePlayer: FC<YouTubePlayerProps> = ({ id }) => {
  return (
    <YouTube videoId={id} />
  );
};

export default YouTubePlayer;