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
import useContentDetails from 'hooks/useContentDetails';
import MoreContent from './MoreContent';
import Contributors from './Contributors';
import { MediaPlayerLoader, MediaMetaDataLoader } from 'components/Loaders';

const Video = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { data: content, isLoading } = useContentDetails();

  return (
    <Grid container spacing={5}>
      <Grid item xs={12} sm={8}>
        {isLoading ? (
          <MediaPlayerLoader type="video" />
        ) : (
          <MediaPlayer url={content?.url || ''} width="100%" />
        )}
        <Stack sx={{mt: '2rem', padding: '2rem'}}>
        <Typography component="h1" variant="body1">
                {content?.title}
              </Typography>
              <Typography component="p" variant="body2">
                {content?.createdDate}
              </Typography>
              <Stack
                spacing={3}
                sx={{
                  // background: theme.palette.grey[800],
                  borderRadius: theme.shape.borderRadius
                }}
              >
                <Typography component="p">{content?.description}</Typography>
                <MediaPlayer url={content?.descriptionUrl || ''} isAudio />
              </Stack>
              </Stack>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Stack sx={{padding: '2rem'}}>
          {isLoading ? (
            <MediaMetaDataLoader />
          ) : (
            <>
              <Contributors contributors={content?.contributors ?? []} />
              <Divider sx={{ margin: '2rem 0' }} light />
              <Stack>
                <Typography component="h4" sx={{ fontWeight: 'body1' }}>
                  {t('Credits')}
                </Typography>
                <Typography component="p" sx={{ fontWeight: 'bold' }}>
                  {content?.credits}
                </Typography>
              </Stack>
              <Divider sx={{ margin: '2rem 0' }} light />
              {content && content.tags.length > 0 && (
                <Stack py="1rem">
                  <Typography component="p">
                    {t('Content Search Tags')}
                  </Typography>
                  <Box sx={{ display: 'flex' }}>
                    {content.tags.map((tag: string) => (
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
