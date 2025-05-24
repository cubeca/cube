import { Box, Typography } from '@mui/material';
import Grid from '@mui/system/Unstable_Grid';
import { useTranslation } from 'react-i18next';
import HeroHome from 'assets/images/hero-home-page.jpeg';
import CtaImage from 'assets/images/home-video-cover.jpeg';
import HeroCTA from 'components/heroCTA';
import * as s from './HeroPanelHome.styled';

const HeroPanelHome = () => {
  const { t } = useTranslation('about');
  return (
    <s.HeroPanelHome>
      <s.Bg>
        <img src={HeroHome} alt="black and white background showing a person drawing" width="100%" height="auto" />
      </s.Bg>

      <s.Content>
        <Grid container>
          <Grid xs={10} xsOffset={1} md={5} mdOffset={1}>
            <s.Headline>
              <Typography component="h1" variant="h1">
                {t('searchPage')}
              </Typography>
              <Typography component="h2" variant="h3" lang="fr">
                {t('searchPageFR')}
              </Typography>
            </s.Headline>
          </Grid>

          <Grid xs={10} xsOffset={1} md={4} mdOffset={2}>
            <HeroCTA
              title="Guide"
              text={t('userGuideSearchPage')}
              frenchText={t('userGuideSearchPageFR')}
              video="https://customer-ayah89x7bps0l5b8.cloudflarestream.com/80307b495fb599c1eb6be7eb503d138d/manifest/video.m3u8"
              image={CtaImage}
              subtitlesUrl="https://files.cubecommons.ca/Search%20Page%20Video%20Two%20Subtitles_Aug%2012%202024.vtt"
            />
          </Grid>
        </Grid>
      </s.Content>
    </s.HeroPanelHome>
  );
};

export default HeroPanelHome;
