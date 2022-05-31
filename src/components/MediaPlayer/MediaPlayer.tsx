import { FC } from 'react';
import ReactPlayer from 'react-player';

interface MediaPlayerProps {
  url: string;
  isAudio?: boolean;
  width?: string;
}

const MediaPlayer: FC<MediaPlayerProps> = ({ url, isAudio, width = '50%' }) => {
  return (
    <ReactPlayer
      url={url}
      config={{
        file: {
          forceVideo: !isAudio,
          forceAudio: isAudio
        }
      }}
      controls
      width={width}
      height="40px"
    />
  );
};

export default MediaPlayer;
