/**
 * `YouTubePlayer` is a component that embeds a YouTube video player into the application using the `react-youtube` library.
 * It accepts a single prop, `id`, which corresponds to the YouTube video ID. The component then renders the video player with the specified video.
 *
 * @param {string} id The YouTube video ID to be played.
 */

import { FC } from 'react';
import YouTube from 'react-youtube';

interface YouTubePlayerProps {
  id: string;
}

const YouTubePlayer: FC<YouTubePlayerProps> = ({ id }) => {
  return <YouTube videoId={id} />;
};

export default YouTubePlayer;
