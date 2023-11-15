import * as s from './MediaPlayer.styled';

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
    <>
      <s.StyledPlayer
        isSafari={isSafari}
        coverArtUrl={coverArtUrl || ''}
        url={url}
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
    </>
  );
};

export default MediaPlayer;
