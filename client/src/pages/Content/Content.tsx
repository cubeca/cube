import {
  Divider,
  Stack,
  Typography,
  useTheme,
  Chip,
  Box
} from '@mui/material';
import Grid from '@mui/system/Unstable_Grid';
import MediaPlayer from 'components/MediaPlayer';
import { useTranslation } from 'react-i18next';
import useContentDetails from 'hooks/useContentDetails';
import MoreContent from './MoreContent';
import Contributors from './Contributors';
import { MediaPlayerLoader, MediaMetaDataLoader } from 'components/Loaders';
import * as s from './Content.styled';

const Video = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { data: content, isLoading } = useContentDetails();
  const formattedCreatedDate = content ? new Date(content.createdDate).toLocaleDateString('en-us', { year: 'numeric', month: 'long', day: 'numeric' }) : '';

  return (
    <Grid container>

      <Grid xs={10} md={9}>
        
        <s.VideoWrapper>
          {isLoading ? (
            <MediaPlayerLoader type="video" />
          ) : (
            <MediaPlayer url={content?.url || ''} width="100%" />
          )}
        </s.VideoWrapper>

        <Stack sx={{mt: '2rem', padding: '2rem'}}>
          <Typography component="h1" variant="h3">
            {content?.title}
          </Typography>

          <Typography component="p" variant="body2">
            {formattedCreatedDate}
          </Typography>

          <Stack spacing={3} sx={{borderRadius: theme.shape.borderRadius}}>
            <Typography component="p" variant="body1">{content?.description}</Typography>
            <MediaPlayer url={content?.descriptionUrl || ''} isAudio />
          </Stack>
        </Stack>

      </Grid>

      <Grid xs={10} md={3}>

        <Stack sx={{padding: '2rem'}}>
          {isLoading ? (
            <MediaMetaDataLoader />
          ) : (
            <>
              
              <Contributors contributors={content?.contributors ?? []} />
              
              <Divider sx={{ margin: '2rem 0' }} light />
              
              <Stack>
                <Typography component="h4" variant="h4" sx={{ color: '#95F5CB' }}>
                  {t('Credits')}
                </Typography>
                <Typography component="p" variant="h5" sx={{ color: '#D9FFEE' }}>
                  {content?.credits}
                </Typography>
              </Stack>

              <Divider sx={{ margin: '2rem 0' }} light />
              
              {content && content.tags.length > 0 && (
                <Stack py="1rem">
                  <Typography component="h4" variant="h4">
                    {t('Tags')}
                  </Typography>
                  <Box sx={{ display: 'flex'}}>
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
