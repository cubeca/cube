import { Grid, Box, Stack, Typography } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';
import HeroLeft from 'assets/images/cubedao-hero-left.png';
import HeroRight from 'assets/images/cubedao-hero-right.png';
import ArrowForwardIcon from '@mui/icons-material/ArrowForwardIos';

import Button from 'components/Button';
import ReactPlayer from 'react-player';
import { flexbox } from '@mui/system';

const HeroPanel = () => {
  const { t } = useTranslation('about');
  return (
    <Box sx={{ width: '100vw', height: '700px' }}>
      <Box sx={{ width: '100vw', height: '1000px', display: 'flex', justifyContent: 'left', alignItems: 'center', backgroundImage: `url('${HeroLeft}')`, backgroundPosition: 'center' }}>
        <Grid
          container
          spacing={0}
          marginTop={'2vh'}
          columnGap="none"
          xs={12} md={12}
          flex-direction={{ xs: 'column', sm: 'column', md: 'row' }}
        >
          <Grid item xs={12} md={7} sx={{ display: 'flex', justifyContent: 'center', mb: '10rem' }}>
            <Box sx={{ width: '80%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', ml: '2rem' }}>
              <Typography component="h2" variant="h2">
                {t('What is this?')}
              </Typography>
              <Typography component="p" variant="body2">
                Cube Commons, is a streaming platform where you can discover
                the video + audio content, digital publications and workbooklets being produced by artists and arts organizations on artistic and cultural practices happening accorss Turtle Island - Canada.
                Search by name or medium, create playlists for students + friends or play a track while your creating.
              </Typography>
              <Button>Start Watching</Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'right' }}>
            <ReactPlayer
              url="https://vimeo.com/243556536"
              sx={{ width: { xs: '40vw', md: '30vw' }, height: { xs: '40vh', md: '70vh' } }}
              overflow="hidden"
              playing
              playIcon={<Box sx={{ padding: "4vw 2vw 2vw 3vw" }}><Typography component="h2" variant="h2">
                {t('Creator?')}</Typography><Typography component="p" variant="body2">Learn how to become a creator and use the platform</Typography><Button>Play</Button></Box>}
              light={HeroRight}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};



export default HeroPanel;
