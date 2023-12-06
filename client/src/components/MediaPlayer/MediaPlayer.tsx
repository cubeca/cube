import * as s from './MediaPlayer.styled';

interface MediaPlayerProps {
  url: string;
  isAudio?: boolean;
  coverArtUrl?: string;
  subtitleUrl?: string;
  coverImageAltText?: string;
}

const MediaPlayer = ({
  url,
  isAudio,
  coverArtUrl,
  subtitleUrl,
  coverImageAltText
}: MediaPlayerProps) => {
  return (
    <>
      <s.StyledPlayer
        coverImageAltText={coverImageAltText}
        coverArtUrl={coverArtUrl || ''}
        url={url}
        config={{
          file: {
            attributes: {
              poster: coverArtUrl,
              controls: true,
              crossOrigin: 'true'
            },
            forceVideo: true,
            tracks: [
              {
                src: subtitleUrl || '',
                kind: 'subtitles',
                srcLang: 'en',
                default: false,
                label: 'English'
              }
            ]
          }
        }}
        controls
        width={'100%'}
        height={'auto'}
        aria-label={coverImageAltText}
      />
    </>
  );
};

export default MediaPlayer;
