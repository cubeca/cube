import { Box, Typography } from '@mui/material';
import Button from 'components/Button';
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
                'Creating a profile on CubeCommons makes you an owner of CubeCommons.'
              )}
            </Typography>
            <Typography component="p">
              {t(
                'As long as there has been internet, arts organizations have depended on third-party platforms to organize and distribute their content. This has created unsustainable fee systems and a precarious relationships with corporations that often go obsolete or make decisions that do not align with our mandates. When organizations load their educational content onto their Cube profile, they earn governance tokens that give them the right to vote on platform changes, additions and maintenance. By pooling our resources we mean to experiment with autonomy, collective governance and new models for education and cultural archiving.'
              )}
            </Typography>
            <Typography component="p">
              {t(
                'We are just getting started; our early adopters get to load as much content as they like and have a say in the development of our governance system. Our governance tokens are not a form of currency and cannot be bought or sold. Only earned through acts of knowledge sharing.'
              )}
            </Typography>
            {/* <Button href="https://www.example.com" variant="contained">
              Browse Our DAO Documentation
            </Button> */}
          </s.CenterColumnTextSection>
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
            <Typography component="h2" variant="h2">
              {t('We Are a Commons')}
            </Typography>
            <Typography component="p">
              {t(
                'CubeCommons was developed through the partnership and collaborative brainstorming of individuals and organizations including @221A, Artengine (@Artengine), Burnaby Art Gallery (@BAG), Centre A (@CentreA), @Cinevolution, Contemporary Art Gallery (@CAG), Museum of Anthropology (@MOA), Museum of Vancouver (@MOV), New Media Gallery (@NMG), Richmond Art Gallery (@RAG), SFU Galleries (@SFUGalleries), and more, from across Canada.'
              )}
            </Typography>
            <Button href="/signup" variant="contained">
              Join Us
            </Button>
          </s.CenterColumnTextSection>
        </Grid>
      </Grid>
    </s.CenterColumnPanel>
  );
};

export default CenterColumnPanel;
