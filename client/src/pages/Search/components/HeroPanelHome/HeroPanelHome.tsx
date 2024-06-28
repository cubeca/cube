import { Box, Typography } from '@mui/material';
import Grid from '@mui/system/Unstable_Grid';
import { useTranslation } from 'react-i18next';
import TagOfTheWeek from '../TagOfTheWeek';
import HeroHome from 'assets/images/hero-home-page.jpeg';
import CtaImage from 'assets/images/home-video-cover.jpeg';
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
              <Typography component="h1" variant="h1">
                {t('searchPage')}
              </Typography>
              <Typography component="h3" variant="h3">
                {t('searchPageFR')}
              </Typography>
              {/* <a href="#TEST" className="play-button">
                <img src={Play} alt="play" />
              </a> */}
            </s.Headline>
          </Grid>

          <Grid xs={10} xsOffset={1} md={4} mdOffset={2}>
            <HeroCTA
              title="Guide"
              text={t('userGuide')}
              frenchText={t('userGuideFR')}
              video="https://customer-ayah89x7bps0l5b8.cloudflarestream.com/1522f4bfdb5e28886e25f58c27c3d278/manifest/video.m3u8"
              image={CtaImage}
              subtitlesUrl="https://files.cubecommons.ca/3ed305be-ff47-4cf2-abb8-6c0d77bcc208/vtt.vtt"
            />
          </Grid>
        </Grid>
      </s.Content>

      <TagOfTheWeek />
    </s.HeroPanelHome>
  );
};

export default HeroPanelHome;
