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
            <Typography component="h3" variant="h3" lang="fr">
              {t('discoverFR')}
            </Typography>
            <s.ExtraTopMargin>
              <Typography component="p" variant="body1">
                {t('heroText')} <span lang="fr">{t('heroTextFR')}</span>
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
            video="https://customer-ayah89x7bps0l5b8.cloudflarestream.com/1ef89ceecd84c1b5d4cf1aee309ffbee/manifest/video.m3u8"
            image={CtaImage}
            subtitlesUrl="https://files.cubecommons.ca/Landing%20Page%20Guide%20Subtitles%20Two%20_Aug%2012%202024.vtt"
          />
        </Grid>
      </s.Content>
    </s.Hero>
  );
};

export default HeroPanel;
