import { Box, Typography } from '@mui/material';
import Grid from '@mui/system/Unstable_Grid';
import { useTranslation } from 'react-i18next';
import TagOfTheWeek from '../TagOfTheWeek';
import HeroHome from 'assets/images/hero-home-page.jpeg';
import CtaImage from 'assets/images/home-video-cover.jpeg';
import Play from 'assets/icons/play-circle.svg';
import HeroCTA from 'components/heroCTA';
import * as s from './HeroPanelHome.styled';

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
              {/* <Typography component="h1" variant="h5">
                <span>{t('Featured in ')}</span>
                <strong className="category">{t('Videos')}</strong>:
              </Typography> */}
              <Typography component="h2" variant="h1">
                Welcome to Our <br />
                Search Page
              </Typography>
              {/* <a href="#TEST" className="play-button">
                <img src={Play} alt="play" />
              </a> */}
            </s.Headline>
          </Grid>

          <Grid xs={10} xsOffset={1} md={4} mdOffset={2}>
            <HeroCTA
              title="How To Use CubeCommons"
              text="Learn how to use this site and start discovering content"
              video="https://vimeo.com/243556536"
              image={CtaImage}
            />
          </Grid>
        </Grid>
      </s.Content>

      <TagOfTheWeek />
    </s.HeroPanelHome>
  );
};

export default HeroPanelHome;
