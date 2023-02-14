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
import { MediaPlayerLoader, MediaMetaDataLoader } from 'components/Loaders';
import useMediaQuery from '@mui/material/useMediaQuery';

const Video = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { data: video, isLoading } = useVideoDetails();
  const matches = useMediaQuery('(min-width:600px)');
  

  return (
    <Grid container spacing={5}>{`(max-width:600px) matches: ${matches}`}
      <Grid item xs={8}>
        {isLoading ? (
          <MediaPlayerLoader type="video" />
        ) : (
          <MediaPlayer url={video?.url || ''} width="100%"/>
        )}
        <Box sx={{ml: '5rem', mr: '5rem', mt: '2rem'}}>
         <Typography component="h4" variant="body1">
                {video?.title}
              </Typography>
              <Typography component="p" variant="body2">
                {video?.createdDate}
              </Typography>
              <Stack
                spacing={3}
                pt="20px"
                sx={{
                  // background: theme.palette.grey[800],
                  borderRadius: theme.shape.borderRadius
                }}
              >
                <Typography component="p">{video?.description}</Typography>
                <MediaPlayer url={video?.descriptionUrl || ''} isAudio />
              </Stack>
              </Box>
      </Grid>
      <Grid item xs={4}>
        <Stack>
          {isLoading ? (
            <MediaMetaDataLoader />
          ) : (
            <>
              <Contributors contributors={video?.contributors ?? []} />
              <Stack>
              <Divider sx={{ margin: '2rem 0' }} light />
                <Typography component="h4" sx={{ fontWeight: 'bold' }}>
                  {t('Credits')}
                </Typography>
                <Typography component="p" sx={{ fontWeight: 'bold' }}>
                  {video?.credits}
                </Typography>
              </Stack>
              <Divider sx={{ margin: '2rem 0' }} light />
              {video && video.tags.length > 0 && (
                <Stack py="1rem">
                  <Typography component="p">
                    {t('Content Search Tags')}
                  </Typography>
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
             
            </>
          )}
          <Divider sx={{ margin: '2rem 0' }} light />
          <MoreContent />
        </Stack>
      </Grid>
    </Grid>
  );
};

export default Video;
