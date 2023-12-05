import { Typography } from '@mui/material';
import Grid from '@mui/system/Unstable_Grid';
import { useTranslation } from 'react-i18next';
import Button from 'components/Button';
import HeroCTA from 'components/heroCTA';
import CtaImage from 'assets/images/home-create-cta-cover.jpg';
import * as s from './HeroPanel.styled';

const HeroPanel = () => {
  const { t } = useTranslation('about');
  return (
    <s.Hero>
      <s.Bg></s.Bg>

      <s.Content container>
        <Grid xs={10} xsOffset={1} md={5}>
          <s.ContentMain>
            <Typography component="h1" variant="h1">
              {t('Discover')}
            </Typography>
            <Typography component="p" variant="body1">
              {t('heroText')}
            </Typography>
            <Button href="/search" variant="contained" size="large">
              {t('Search Content')}
            </Button>
          </s.ContentMain>
        </Grid>

        <Grid xs={10} xsOffset={1} md={4} mdOffset={2}>
          <HeroCTA
            title="Create"
            text={t('becomeCreatorText')}
            video="https://customer-ayah89x7bps0l5b8.cloudflarestream.com/43df9c06ed57348a3414802cf1d565f8/manifest/video.m3u8"
            image={CtaImage}
            subtitlesUrl="https://files.cubecommons.ca/24978756-8ad3-4d7b-8412-b1bde69ec26f/vtt.vtt"
          />
        </Grid>
      </s.Content>
    </s.Hero>
  );
};

export default HeroPanel;
