import { FC } from 'react';
import ReactPlayer from 'react-player';
import './MediaPlayer.css';

interface MediaPlayerProps {
  url: string;
  isAudio?: boolean;
  coverArtUrl?: string;
  subtitleUrl?: string;
  isSafari?: boolean;
}

const MediaPlayer = ({
  url,
  isAudio,
  coverArtUrl,
  subtitleUrl,
  isSafari
}: MediaPlayerProps) => {
  return (
    <ReactPlayer
      url={url}
      style={{
        backgroundImage: isSafari ? `url('${coverArtUrl}')` : undefined,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        zIndex: 1,
        height: '100%'
      }}
      config={{
        file: {
          attributes: {
            poster: coverArtUrl,
            controls: true
          },
          forceVideo: true,
          tracks: [
            {
              src: subtitleUrl || '',
              kind: 'subtitles',
              srcLang: 'en',
              default: true,
              label: 'English'
            }
          ]
        }
      }}
      controls
      width={'100%'}
      height={'auto'}
    />
  );
};

export default MediaPlayer;
