import Skeleton from '@mui/material/Skeleton';

export const VideosLoader: React.FC<{ size: number }> = ({
  size
}: {
  size: number;
}) => {
  return (
    <>
      {[...Array(size)].map((el, i) => (
        <Skeleton
          key={i}
          variant="rectangular"
          width={200}
          height={150}
          sx={{ borderRadius: 5 }}
        />
      ))}
    </>
  );
};
