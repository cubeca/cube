/**
 * `MediaPlayer` renders a media player using the `video-react` library.
 * It is designed to support video playback with customizable subtitles. The component accepts a `src` prop for the video source,
 * an optional `coverImageAltText` for accessibility, and a predefined set of subtitles in English.
 *
 * @param {string} url The source URL of the video to be played.
 * @param {string} [coverImageAltText] Optional alt text for the video, enhancing accessibility.
 * @param {string} [subtitleUrl] Optional URL for the subtitles file.
 */

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
        height={'10vh'}
        aria-label={coverImageAltText}
      />
    </>
  );
};

export default MediaPlayer;
