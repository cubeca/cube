import { Box, Stack, Typography } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';
import HeroLeft from 'assets/images/cubedao-hero-left.png';
import HeroRight from 'assets/images/cubedao-hero-right.png';
import ArrowForwardIcon from '@mui/icons-material/ArrowForwardIos';

import Button from 'components/Button';
import ReactPlayer from 'react-player';

const HeroPanel = () => {
  const { t } = useTranslation('about');
  return (
    <Box sx={{width: '100vw', height: '700px'}}>
      <Box sx={{width: '100%', height: '1000px', display: 'flex', justifyContent: 'left', alignItems: 'center', backgroundImage: `url('${HeroLeft}')`, backgroundPosition: 'center'}}>
        {/* <Box sx={{position: 'absolute', top: '0', left: '0', opacity: '0.5', zIndex: '-5'}}>
        <img src={HeroLeft} alt="Shadow woman dancing" width="100%"/>
        </Box> */}
       <Box sx={{ml: '30px', width: '100%', height: '650px', display:'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start'}}>
        <Box sx={{width: '50%', height: '500px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', ml: '2rem'}}>
        <Typography component="h2" variant="h2">
            {t('What is this?')}
          </Typography>
          <Typography component="p" variant="body2">
              Cube Commons, is a streaming platform where you can discover
              the video + audio content, digital publications and workbooklets being produced by artists and arts organizations on artistic and cultural practices happening accorss Turtle Island - Canada.
              Search by name or medium, create playlists for students + friends or play a track while your creating.
            </Typography>
        <Button>Start Watching</Button>
        </Box>
        <ReactPlayer
        url="https://vimeo.com/243556536"
        width="40%"
        height="400px"
        playing
        playIcon={<Box sx={{padding: "4vw 2vw 2vw 3vw"}}><Typography component="h2" variant="h2">
        {t('Creator?')}</Typography><Typography component="p" variant="body2">Learn how to become a creator and use the platform</Typography><Button>Play</Button></Box>}
        light={HeroRight}
        />
        </Box>
        </Box>
      </Box>
  );
};



export default HeroPanel;
