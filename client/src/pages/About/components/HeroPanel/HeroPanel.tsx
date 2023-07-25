import { Typography } from '@mui/material';
import Grid from '@mui/system/Unstable_Grid';
import { useTranslation } from 'react-i18next';
import CTABg from 'assets/images/about-hero-cta-bg.png';
import PlaySymbol from 'assets/icons/play-symbol.svg';
import Play from 'assets/icons/play-circle.svg';
import ReactPlayer from 'react-player';
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
              {t(
                'heroText'
              )}
            </Typography>
            <a className="play-button" href="#TEST">
              <img src={Play} alt="play" />
            </a>
          </s.ContentMain>
        </Grid>

        <Grid xs={12} md={4} mdOffset={2}>
          <s.ContentCTA>
            <ReactPlayer
              url="https://vimeo.com/243556536"
              width="100%"
              height="100%"
              overflow="hidden"
              playing
              playIcon={
                <s.ContentCTAPlay>
                  <Typography component="h1" variant="h1">
                    {t('Create')}
                  </Typography>
                  <Typography component="p" variant="body1">
                    {t('becomeCreatorText')}
                  </Typography>
                  <img className="play-button" src={PlaySymbol} alt="play" />
                </s.ContentCTAPlay>
              }
              light={CTABg}
            />
          </s.ContentCTA>
        </Grid>
      </s.Content>
    </s.Hero>
  );
};

export default HeroPanel;
