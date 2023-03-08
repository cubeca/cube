import { Grid, Box, Stack, Typography } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';
import HeroLeft from 'assets/images/cubedao-hero-left.png';
import HeroRight from 'assets/images/cubedao-hero-right.png';
import PlaySymbol from 'assets/icons/play-symbol.svg';
import Play from 'assets/icons/play-circle.svg';

import Button from 'components/Button';
import ReactPlayer from 'react-player';
import { flexbox } from '@mui/system';

const HeroPanel = () => {
  const { t } = useTranslation('about');
  return (
    <Box sx={{ width: '100vw', height: '700px' }}>
      <Box sx={{ width: '100vw', display: 'flex', justifyContent: 'left', alignItems: 'center', backgroundImage: `url('${HeroLeft}')`, backgroundPosition: 'center', paddingTop: '25vh' }}>
      <Grid
          container
          spacing={0}
          marginTop={'5vh'}
          columnGap="none"
          xs={12} md={12}
          flex-direction={{ xs: 'column', sm: 'column', md: 'row' }}
          justifyContent="flex-end"
       
          pb="60vh"
        >
          <Grid item xs={12} sm={12} md={5} height= "70vh">
          <Typography component="h1" variant="h1">
                {t('Start Watching')}
              </Typography>
              <Typography component="p" variant="body1" mr={{ xs: '0', sm: '0', md: '5rem' }}>
              {t('heroText')}
              </Typography>
              <Box sx={{display: 'flex', justifyContent: 'left', width: '100%', p: '4rem'}}><a href="www.happy.com"><img src={Play} alt="play"/></a></Box>
          </Grid>
          <Grid item xs={12} sm={12} md={1}>
            
          </Grid>
          <Grid item xs={12} sm={12} md={5}>
           
                <ReactPlayer
              url="https://vimeo.com/243556536"
              width="100%"
              height="100%"
              overflow="hidden"
              playing
              playIcon={<Box sx={{ padding: "0vw 5vw 2vw 5vw" }}><Typography component="h1" variant="h1" color="#28343C">
                {t('Creator?')}</Typography><Typography component="p" variant="body1" fontWeight="500" color="#28343C">Learn how to become a creator and use CubeCommons</Typography><Box sx={{display: 'flex', justifyContent: 'left', width: '100%', p: '4rem'}}><a href="www.happy.com"><img src={PlaySymbol} alt="play"/></a></Box></Box>}
              light={HeroRight}
            />
          </Grid>
          </Grid>
      </Box>
    </Box>
  );
};



export default HeroPanel;
