import { Box, Button, Typography } from '@mui/material';
import Grid from '@mui/system/Unstable_Grid';
import MediaPlayer from 'components/MediaPlayer';
import { Trans, useTranslation } from 'react-i18next';
import FirstTopThumb from 'assets/images/fpo/billetto-editorial-dGYN1ApujRo-unsplash-thumb.png';
import SecondTopThumb from 'assets/images/fpo/daniels-joffe-PhQ4CpXLEX4-unsplash-thumb.png';
import ThirdTopThumb from 'assets/images/fpo/pawel-czerwinski-Kd_IiyO7IqQ-unsplash-thumb.png';
import FourthTopThumb from 'assets/images/fpo/ryan-stefan-5K98ScREEUY-unsplash-thumb.png';
import FirstBottomThumb from 'assets/images/fpo/filip-zrnzevic-QsWG0kjPQRY-unsplash-thumb.png';
import SecondBottomThumb from 'assets/images/fpo/coline-beulin-oLWGI-Q76Yc-unsplash-thumb.png';
import ThirdBottomThumb from 'assets/images/fpo/abi-baurer-2xbcFBRGsZo-unsplash-thumb.png';
import FourthBottomThumb from 'assets/images/fpo/eldar-nazarov-gnYfMrL0rck-unsplash-thumb.png';
import ThumbnailGrid from '../ThumbnailGrid';
import * as s from './CenterColumnPanel.styled';

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
          <s.CenterColumnTextSection>
            <Typography component="h2" variant="h2">
              {t('We Are a DAO')}
            </Typography>
            <Typography component="p">
              {t(
                'A DAO is a decentralized autonomous organization; made possible by the technology it is built on. CubeCommons operates like a DAO while fulfilling the requirements of a not-for-profit. This means that all content creators on Cube are collective owners of the platform they share.'
              )}
            </Typography>
            <Typography component="p">
              {t(
                'Cube does not produce a publicly traded token, only an internal governance token that Cube creators earn for uploading free, accessible content. They use their governance tokens to vote on improvements to the site and the managing of Cube’s assets. By using the blockchain for voting we make these decisions publicly transparent.'
              )}
            </Typography>
            <Typography component="p">
              {t(
                'Cube, unlike other streaming platforms, does not sell your data. The art organizations here are dedicated to sustainable online ecosystems, that engage with audiences and creators in equitable ways.'
              )}
            </Typography>
            <Button href="https://www.example.com" variant="contained">
              Browse Our DAO Documentation
            </Button>
          </s.CenterColumnTextSection>
          <s.CenterColumnTextSection>
            <Typography component="h2" variant="h2">
              {t('We Are a Commons')}
            </Typography>
            <Typography component="p">
              {t(
                'CubeCommons was developed through the partnership and collaborative brainstorming of individuals and organizations including @221A, Artengine (@Artengine), Burnaby Art Gallery (@BAG), Centre A (@CentreA), @Cinevolution, Contemporary Art Gallery (@CAG), Museum of Anthropology (@MOA), Museum of Vancouver (@MOV), New Media Gallery (@NMG), Richmond Art Gallery (@RAG), SFU Galleries (@SFUGalleries), and more, from across Canada.'
              )}
            </Typography>
            <Button href="https://www.example.com" variant="contained">
              Join Us
            </Button>
          </s.CenterColumnTextSection>
        </Grid>
        <Grid xs={12} md={3} mdOffset={1}>
          <ThumbnailGrid
            thumbs={btmThumbGrid}
            alignment={'bottom'}
          ></ThumbnailGrid>
        </Grid>
      </Grid>
    </s.CenterColumnPanel>
  );
};

export default CenterColumnPanel;
