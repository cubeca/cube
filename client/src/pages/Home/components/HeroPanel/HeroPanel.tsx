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
              {t('discover')}
            </Typography>
            <Typography component="h3" variant="h3">
              {t('discoverFR')}
            </Typography>
            <s.ExtraTopMargin>
            <Typography component="p" variant="body1">
              {t('heroText')} <span>{t('heroTextFR')}</span>
            </Typography>
            </s.ExtraTopMargin>

            <Button href="/search" variant="contained" size="large">
              {t('search')}
            </Button>
          </s.ContentMain>
        </Grid>

        <Grid xs={10} xsOffset={1} md={4} mdOffset={2}>
          <HeroCTA
            title="Guide"
            text={t('becomeCreatorText')}
            frenchText={t('becomeCreatorTextFR')}
            video="https://customer-ayah89x7bps0l5b8.cloudflarestream.com/002d576b577461da5c6426eccd01ddfa/manifest/video.m3u8"
            image={CtaImage}
            subtitlesUrl="https://pub-7f4bf083e7344d06b67371aec183bddb.r2.dev/vttSubtitles%20(5).vtt"
          />
        </Grid>
      </s.Content>
    </s.Hero>
  );
};

export default HeroPanel;
