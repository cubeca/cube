/**
 * This file defines two components, `ContentLoader` and `MediaPlayerLoader`,
 * both utilizing Material-UI's `Skeleton` component to display loading placeholders.
 * These loaders are designed to provide visual feedback during content loading states in a UI.
 *
 * `ContentLoader` displays a series of skeleton blocks based on a specified size,
 * typically used for loading states of content lists or cards.
 *
 * @param {number} size The number of skeleton blocks to render.
 *
 * `MediaPlayerLoader` displays a single skeleton block with dimensions tailored to the type of media content being loaded
 * (audio, video, pdf, link, or document), providing a contextual loading placeholder.
 *
 * @param {'audio' | 'video' | 'pdf' | 'link' | 'document'} type The type of media content, which determines the skeleton's size.
 */

import { Stack } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';

export const ContentLoader: React.FC<{ size: number }> = ({
  size
}: {
  size: number;
}) => {
  return (
    <>
      {[...Array(size)].map((el, i) => (
        <Skeleton
          key={i}
          width={200}
          height={150}
          sx={{ borderRadius: 5 }}
          animation="wave"
        />
      ))}
    </>
  );
};

export const MediaPlayerLoader: React.FC<{
  type: 'audio' | 'video' | 'pdf' | 'link' | 'document';
}> = ({ type }: { type: 'audio' | 'video' | 'pdf' | 'link' | 'document' }) => (
  <Skeleton
    width="100%"
    height={type === 'audio' ? '40px' : '400px'}
    animation="wave"
  />
);

export const MediaMetaDataLoader: React.FC = () => (
  <Stack>
    <Skeleton width="100%" height={40} animation="wave" />
    <Skeleton width="100%" height={40} animation="wave" />
    <Skeleton width="100%" height={40} animation="wave" />
    <Skeleton width="100%" height={40} animation="wave" />
  </Stack>
);
