import { Box, Typography } from '@mui/material';
import Grid from '@mui/system/Unstable_Grid';
import { useTranslation } from 'react-i18next';
import TagOfTheWeek from '../TagOfTheWeek';
import HeroHome from 'assets/images/hero-home-page.jpeg';
import HeroRight from 'assets/images/home-video-cover.jpeg';
import Play from 'assets/icons/play-circle.svg';
import { ReactComponent as PlaySymbol } from 'assets/icons/play-symbol.svg'
import * as s from './HeroPanelHome.styled';
import ReactPlayer from 'react-player';

const HeroPanelHome = () => {
  const { t } = useTranslation('about');
  return (
    <s.HeroPanelHome>

      <s.Bg>
        <img src={HeroHome} alt="hero" width="100%" height="auto" />
      </s.Bg>

      <s.Content>
        <Grid container>

          <Grid xs={10} xsOffset={1} md={5} mdOffset={1}>
            <s.Headline>
              <Typography component="h1" variant="h5">
                <span>{t('Featured in ')}</span>
                <strong className="category">{t('Videos')}</strong>
                :
              </Typography>
              <Typography component="h2" variant="h1">
                Movement As Collective Process
              </Typography>
              <a href="#TEST" className="play-button"><img src={Play} alt="play"/></a>
            </s.Headline>
          </Grid>

          <Grid xs={10} xsOffset={1} md={4} mdOffset={2}>
            <s.CTA>
              <s.CTAContent>
                <Typography component="h2" variant="h3" sx={{color: '#2F4048'}}>How To Use CubeCommons</Typography>
                <Typography component="p" variant="body1" sx={{color: '#2F4048'}}>Learn how to use this site and start discovering content</Typography>
              </s.CTAContent>
              <s.CTAVideo>
                <ReactPlayer
                  url="https://vimeo.com/243556536"
                  width="100%"
                  height="100%"
                  overflow="hidden"
                  playing
                  playIcon={<Box className="play-button"><a href="#TEST"><PlaySymbol /></a></Box>}
                  light={HeroRight}
                />
              </s.CTAVideo>
            </s.CTA>
          </Grid>

        </Grid>
      </s.Content>

      <TagOfTheWeek />

    </s.HeroPanelHome>
  );
};

export default HeroPanelHome;