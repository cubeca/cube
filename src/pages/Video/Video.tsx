import {
  Divider,
  Grid,
  Stack,
  Typography,
  useTheme,
  Chip,
  Box
} from '@mui/material';
import MediaPlayer from 'components/MediaPlayer';
import { useTranslation } from 'react-i18next';
import useVideoDetails from 'hooks/useVideoDetails';
import MoreContent from './MoreContent';
import Contributors from './Contributors';

const Video = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { data: video, isLoading } = useVideoDetails();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Grid container spacing={5} px="5rem">
      <Grid item xs={8}>
        <MediaPlayer url={video?.url || ''} width="100%" />
      </Grid>
      <Grid item xs={4}>
        <Stack>
          <Contributors contributors={video?.contributors ?? []} />
          <Typography component="h4" variant="body1">
            {video?.title}
          </Typography>
          <Typography component="p" variant="body1">
            {video?.createdDate}
          </Typography>
          <Stack
            spacing={3}
            padding="20px"
            sx={{
              background: theme.palette.grey[800],
              borderRadius: theme.shape.borderRadius
            }}
          >
            <Typography component="p">{video?.description}</Typography>
            <MediaPlayer url={video?.descriptionUrl || ''} isAudio />
          </Stack>
          {video && video.tags.length > 0 && (
            <Stack py="1rem">
              <Typography component="p">{t('Content Search Tags')}</Typography>
              <Box sx={{ display: 'flex' }}>
                {video.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    variant="outlined"
                    sx={{ m: 0.5 }}
                  />
                ))}
              </Box>
            </Stack>
          )}
          <Stack>
            <Typography component="h4" sx={{ fontWeight: 'bold' }}>
              {t('Credits')}
            </Typography>
            <Typography component="p" sx={{ fontWeight: 'bold' }}>
              {video?.credits}
            </Typography>
          </Stack>
          <Divider sx={{ margin: '2rem 0' }} light />
          <MoreContent />
        </Stack>
      </Grid>
    </Grid>
  );
};

export default Video;
