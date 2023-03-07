import { Grid, Box, Stack, Typography } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';
import HeroHome from 'assets/images/hero-home-page.jpeg';
import HeroRight from 'assets/images/home-video-cover.jpeg';
import Play from 'assets/icons/play-circle-green.svg';
import PlaySymbol from 'assets/icons/play-symbol-green.svg'

import Button from 'components/Button';
import ReactPlayer from 'react-player';
import { flexbox } from '@mui/system';

const HeroPanelHome = () => {
  const { t } = useTranslation('about');
  return (
    <Box sx={{ width: '100vw', height: '700px' }}>
      <Box sx={{ width: '100vw', display: 'flex', justifyContent: 'left', alignItems: 'center', backgroundImage: `url('${HeroHome}')`, backgroundPosition: 'center', backgroundSize: 'cover' }}>
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
          <Grid item xs={12} sm={12} md={6} m="3rem 5rem">
          <Typography component="h1" variant="h5">
                {t('Featured in Videos')}
              </Typography>
              <Typography component="h2" variant="h2" mr="5rem">
                Movement As Collective Process
              </Typography>
              <a href="www.happy.com"><img src={Play} alt="play" height="20%"/></a>
              
          </Grid>
          <Grid item xs={12} sm={12} md={4}>
           <Box sx={{background: '#D9FFEE', height: 'fit-content', p:'2rem'}}>
            <Typography component="h2" variant="h3" sx={{color: '#2F4048'}}>How To Use CubeCommons</Typography>
            <Typography component="p" variant="body1" sx={{color: '#2F4048'}}>Learn how to use this site and start discovering content</Typography>
           </Box>
                <ReactPlayer
              url="https://vimeo.com/243556536"
              width="100%"
             height="45%"
              overflow="hidden"
              playing
              playIcon={<Box sx={{display: 'flex', justifyContent: 'left', width: '100%', p: '4rem'}}><a href="www.happy.com"><img src={PlaySymbol} alt="play"/></a></Box>}
              light={HeroRight}
            />
          </Grid>
          </Grid>
      </Box>
    </Box>
  );
};



export default HeroPanelHome;
