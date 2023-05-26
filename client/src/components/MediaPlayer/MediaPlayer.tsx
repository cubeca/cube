import { FC } from 'react';
import ReactPlayer from 'react-player';

interface MediaPlayerProps {
  url: string;
  isAudio?: boolean;
}

const MediaPlayer: FC<MediaPlayerProps> = ({ url, isAudio }) => {
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
      width={'100%'}
      height={isAudio ? '40px' : 'auto'}
    />
  );
};

export default MediaPlayer;
