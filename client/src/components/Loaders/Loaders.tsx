import { Box, Stack } from '@mui/material';
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
  type: 'audio' | 'video' | 'pdf' | 'link';
}> = ({ type }: { type: 'audio' | 'video' | 'pdf' | 'link' }) => (
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
