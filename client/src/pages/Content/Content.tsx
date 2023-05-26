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
import Footer from 'components/layout/Footer';
import * as s from './Content.styled';

const Video = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { data: content, isLoading } = useContentDetails();
  const formattedCreatedDate = content ? new Date(content.createdDate).toLocaleDateString('en-us', { year: 'numeric', month: 'long', day: 'numeric' }) : '';

  return (
    <Box>
      <Grid container justifyContent="center">
        <Grid xs={12} md={9}>
          
          <s.VideoWrapper>
            {isLoading ? (
              <MediaPlayerLoader type="video" />
            ) : (
              <MediaPlayer url={content?.url || ''} />
            )}
          </s.VideoWrapper>

          <s.ContentWrapper>
            <Typography component="h1" variant="h3">
              {content?.title}
            </Typography>

            <s.ContentDate component="p" variant="body2">
              {formattedCreatedDate}
            </s.ContentDate>
            
            <Typography component="p" variant="body1">{content?.description}</Typography>

            {/* Testing fonts language support: <br/><br/>
            <Typography component="h1" variant="h3">
              hən̓q̓əmin̓əm̓ and Sḵwx̱wú7mesh Ta Nexwníw̓ n ta a Ímats, 授业
            </Typography>
            <br/>
            <Typography component="p" variant="body2">
              These are hən̓q̓əmin̓əm̓ and Sḵwx̱wú7mesh Ta Nexwníw̓ n ta a Ímats, 授业 [teachings] bequethed from ancestors to children of both Indigenous and migrant Chinese families. 从祖母到孙女，这些故事代代相传。[Cóng zǔmǔ dào sūnnǚ, zhèxiē gùshì dài dài xiāngchuán.]
            </Typography>
            <br/><br/> */}

            <MediaPlayer url={content?.descriptionUrl || ''} isAudio />
            
          </s.ContentWrapper>

        </Grid>
        <Grid xs={10} md={3}>

          <s.Sidebar>
            {isLoading ? (
              <MediaMetaDataLoader />
            ) : (
              <>
                
                <Contributors contributors={content?.contributors ?? []} />
                
                <s.Seperator />
                
                <Stack>
                  <Typography component="h5" variant="h5">
                    {t('Credits')}
                  </Typography>
                  <Typography component="p" variant="body2">
                    {content?.credits}
                  </Typography>
                </Stack>

                <s.Seperator />
                
                {content && content.tags.length > 0 && (
                  <Stack>
                    <Typography component="h5" variant="h5">
                      {t('Tags')}
                    </Typography>
                    <s.Tags sx={{ display: 'flex'}}>
                      {content.tags.map((tag: string) => (
                        <Chip
                          key={tag}
                          label={tag}
                          sx={{ m: 0.5 }}
                        />
                      ))}
                    </s.Tags>
                  </Stack>
                )}  

              </>
            )}

            <s.Seperator />
            
            <MoreContent />
          
          </s.Sidebar>

        </Grid>
      </Grid>
      <Footer />
    </Box>
  );
};

export default Video;
