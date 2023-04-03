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
import useContentFile from 'hooks/useContentFile';
import { FilesDetailsResponsePlayerInfoOneOf } from '@cubeca/bff-client-oas-axios';

const Content = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { data: content, isLoading } = useContentDetails();
  const { data: fileDetails } = useContentFile(content?.mediaFileId || '');

  return (
    <Grid container spacing={5}>
      <Grid item xs={12} sm={8}>
        {isLoading ? (
          <MediaPlayerLoader type="video" />
        ) : (
          <MediaPlayer
            url={
              (fileDetails?.playerInfo as FilesDetailsResponsePlayerInfoOneOf)
                ?.hlsUrl || ''
            }
            width="100%"
          />
        )}
        <Stack sx={{ mt: '2rem', padding: '2rem' }}>
          <Typography component="h1" variant="h1" sx={{ color: '#95F5CB' }}>
            {content?.title}
          </Typography>
          <Typography component="p" variant="body2" sx={{ color: '#D9FFEE' }}>
            {content?.createdDate}
          </Typography>
          <Stack
            spacing={3}
            sx={{
              // background: theme.palette.grey[800],
              borderRadius: theme.shape.borderRadius
            }}
          >
            <Typography component="p" variant="body1" sx={{ color: '#D9FFEE' }}>
              {content?.description}
            </Typography>
            <MediaPlayer url={content?.descriptionUrl || ''} isAudio />
          </Stack>
        </Stack>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Stack sx={{ padding: '2rem' }}>
          {isLoading ? (
            <MediaMetaDataLoader />
          ) : (
            <>
              <Contributors contributors={content?.contributors ?? []} />
              <Divider sx={{ margin: '2rem 0' }} light />
              <Stack>
                <Typography
                  component="h4"
                  variant="h4"
                  sx={{ color: '#95F5CB' }}
                >
                  {t('Credits')}
                </Typography>
                <Typography
                  component="p"
                  variant="h5"
                  sx={{ color: '#D9FFEE' }}
                >
                  {content?.credits}
                </Typography>
              </Stack>
              <Divider sx={{ margin: '2rem 0' }} light />
              {content && content.tags.length > 0 && (
                <Stack py="1rem">
                  <Typography component="h4" variant="h4">
                    {t('Tags')}
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

export default Content;
