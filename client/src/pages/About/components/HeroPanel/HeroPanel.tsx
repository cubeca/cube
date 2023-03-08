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
      <Box sx={{ width: '100vw', display: 'flex', justifyContent: 'left', alignItems: 'center', backgroundImage: `url('${HeroLeft}')`, backgroundPosition: 'center' }}>
      <Grid
          container
          spacing={0}
          marginTop={'2vh'}
          columnGap="none"
          xs={12} md={12}
          flex-direction={{ xs: 'column', sm: 'column', md: 'row' }}
          justifyContent="flex-end"
          pt="20vh"
          pb="60vh"
        >
          <Grid item xs={12} sm={12} md={6} m="5rem">
          <Typography component="h1" variant="h1">
                {t('What is CubeCommons?')}
              </Typography>
              <Typography component="p" variant="body1" mr="5rem">
                CubeCommons is a platform for discovering the video + audio content, digital publications and workbooklets being produced by artists and arts organizations about the artistic and cultural practices happening accorss Turtle Island - Canada.
                Search by name or medium, create playlists for students + friends, or play a track while you are creating.
              </Typography>
              <Button>Start Watching</Button>
          </Grid>
          <Grid item xs={12} sm={12} md={4}>
           
                <ReactPlayer
              url="https://vimeo.com/243556536"
              width="100%"
              height="100%"
              overflow="hidden"
              playing
              playIcon={<Box sx={{ padding: "0vw 5vw 2vw 5vw" }}><Typography component="h1" variant="h1" color="#28343C">
                {t('Creator?')}</Typography><Typography component="p" variant="body1" fontWeight="500" color="#28343C">Learn how to become a creator and use CubeCommons</Typography><Button>Play</Button></Box>}
              light={HeroRight}
            />
          </Grid>
          </Grid>
      </Box>
    </Box>
  );
};



export default HeroPanel;
