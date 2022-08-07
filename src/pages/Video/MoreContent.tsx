import {
  Divider,
  Grid,
  Link,
  Stack,
  Typography,
  useTheme
} from '@mui/material';
import MediaPlayer from 'components/MediaPlayer';
import VideoImage from 'assets/images/video-image.jpg';
import { useTranslation } from 'react-i18next';
import VideoList from 'components/VideoList';
import useVideos from 'hooks/useVideos';
import { VideosLoader } from 'components/Loaders';

const MoreContent = () => {
  const { t } = useTranslation();
  const { data, isLoading } = useVideos();

  const videos = data?.videos ?? [];

  return (
    <Stack pb="2rem">
      <Typography component="h4" pb="1rem" sx={{ fontWeight: 'bold' }}>
        {t('More Content')}
      </Typography>
      {!isLoading ? (
        <VideoList videos={videos.slice(0, 3)} />
      ) : (
        <Stack direction="row" spacing={4}>
          <VideosLoader size={2} />
        </Stack>
      )}
    </Stack>
  );
};

export default MoreContent;
