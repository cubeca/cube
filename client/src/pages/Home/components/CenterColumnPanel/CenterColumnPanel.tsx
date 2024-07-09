import { Typography } from '@mui/material';
import Button from 'components/Button';
import Grid from '@mui/system/Unstable_Grid';
import { useTranslation } from 'react-i18next';
import FirstTopThumb from 'assets/images/fpo/cont-art-gal-thumb1.png';
import SecondTopThumb from 'assets/images/fpo/daniels-joffe-PhQ4CpXLEX4-unsplash-thumb.png';
import ThirdTopThumb from 'assets/images/fpo/pawel-czerwinski-Kd_IiyO7IqQ-unsplash-thumb.png';
import FourthTopThumb from 'assets/images/fpo/third-top-thumb.png';
import FirstBottomThumb from 'assets/images/fpo/first-bottom-thumb.png';
import SecondBottomThumb from 'assets/images/fpo/coline-beulin-oLWGI-Q76Yc-unsplash-thumb.png';
import ThirdBottomThumb from 'assets/images/fpo/third-bottom-thumb.png';
import FourthBottomThumb from 'assets/images/fpo/eldar-nazarov-gnYfMrL0rck-unsplash-thumb.png';
import ThumbnailGrid from '../ThumbnailGrid';
import * as s from './CenterColumnPanel.styled';
import * as DarkContent from 'components/DarkContent.styled';

const CenterColumnPanel = () => {
  const { t } = useTranslation('about');

  const topThumbGrid = [
    { type: 'transparent' },
    { type: 'img', src: FirstTopThumb },
    { type: 'img', src: SecondTopThumb },
    { type: 'dark' },
    { type: 'light' },
    { type: 'transparent' },
    { type: 'transparent' },
    { type: 'img', src: ThirdTopThumb },
    { type: 'img', src: FourthTopThumb },
    { type: 'transparent' }
  ];

  const btmThumbGrid = [
    { type: 'transparent' },
    { type: 'img', src: FirstBottomThumb },
    { type: 'img', src: SecondBottomThumb },
    { type: 'light' },
    { type: 'transparent' },
    { type: 'img', src: ThirdBottomThumb },
    { type: 'img', src: FourthBottomThumb },
    { type: 'transparent' }
  ];

  return (
    <s.CenterColumnPanel>
      <Grid container>
        <Grid xs={12} md={3}>
          <ThumbnailGrid
            thumbs={topThumbGrid}
            alignment={'top'}
          ></ThumbnailGrid>
        </Grid>
        <Grid xs={10} xsOffset={1} md={4}>
          <DarkContent.Wrapper>
            <s.CenterColumnTextSection>
              <Typography component="h2" variant="h2">
                {t('dao')}
              </Typography>
              <Typography component="p">{t('daoTagline')}</Typography>
              <Typography component="p">{t('daoText')}</Typography>
              <Typography component="p" variant="h3">
                {t('daoFR')}
              </Typography>
              <Typography component="p" variant="body2">
                {t('daoTaglineFR')}
              </Typography>
              <Typography component="p" variant="body2">
                {t('daoTextFR')}
              </Typography>
            </s.CenterColumnTextSection>
          </DarkContent.Wrapper>
        </Grid>
        <Grid xs={10} xsOffset={1} md={3}></Grid>
        <Grid xs={10} xsOffset={1} md={2}></Grid>
        <Grid xs={12} md={3} mdOffset={1} order={{ md: 2 }}>
          <ThumbnailGrid
            thumbs={btmThumbGrid}
            alignment={'bottom'}
          ></ThumbnailGrid>
        </Grid>
        <Grid xs={10} xsOffset={1} md={4}>
          <s.CenterColumnTextSection>
            <DarkContent.Wrapper>
              <Typography component="h2" variant="h2">
                {t('creators')}
              </Typography>
              <Typography component="p">{t('creatorsText')}</Typography>
              <Typography component="p">{t('creatorsList')}</Typography>
              <Typography component="p" variant="h3">
                {t('creatorsFR')}
              </Typography>
              <Typography variant="body2">{t('creatorsTextFR')}</Typography>
              <Button href="/signup" variant="contained">
                Join Us
              </Button>
            </DarkContent.Wrapper>
          </s.CenterColumnTextSection>
        </Grid>
      </Grid>
    </s.CenterColumnPanel>
  );
};

export default CenterColumnPanel;
