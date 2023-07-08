import { Box, Typography } from '@mui/material';
import Grid from '@mui/system/Unstable_Grid';
import { Trans, useTranslation } from 'react-i18next';
import HeroCTABg from 'assets/images/about-hero-cta-bg.png';
import PlaySymbol from 'assets/icons/play-symbol.svg';
import Play from 'assets/icons/play-circle.svg';
import ReactPlayer from 'react-player';
import * as s from './HeroPanel.styled';

const HeroPanel = () => {
  const { t } = useTranslation('about');
  return (
    <s.Hero>
      <s.HeroBg></s.HeroBg>

      <s.HeroContent container>
        <Grid xs={10} xsOffset={1} md={5}>
          <s.HeroContentMain>
            <Typography component="h1" variant="h1">
              {t('Discover')}
            </Typography>
            <Typography component="p" variant="body1">
              {t(
                'heroText'
              )}
            </Typography>
            <a className="play-button" href="www.happy.com">
              <img src={Play} alt="play" />
            </a>
          </s.HeroContentMain>
        </Grid>

        <Grid xs={12} md={4} mdOffset={2}>
          <s.HeroContentCTA>
            <ReactPlayer
              url="https://vimeo.com/243556536"
              width="100%"
              height="100%"
              overflow="hidden"
              playing
              playIcon={
                <s.HeroContentCTAPlay>
                  <Typography component="h1" variant="h1">
                    {t('Create')}
                  </Typography>
                  <Typography component="p" variant="body1">
                    {t('becomeCreatorText')}
                  </Typography>
                  <img className="play-button" src={PlaySymbol} alt="play" />
                </s.HeroContentCTAPlay>
              }
              light={HeroCTABg}
            />
          </s.HeroContentCTA>
        </Grid>
      </s.HeroContent>
    </s.Hero>
  );
};

export default HeroPanel;
