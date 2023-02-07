import { Box, Stack, Typography } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';
// import AboutPanel from '../AboutPanel';
import HeroLeft from 'assets/images/cubedao-hero-left.png';
import HeroRight from 'assets/images/cubedao-hero-right.png';
// import CubeDao from 'assets/images/cubedao.png';
// import MediaPlayer from 'components/MediaPlayer';
import ArrowForwardIcon from '@mui/icons-material/ArrowForwardIos';

import Button from 'components/Button';
import ReactPlayer from 'react-player';

const HeroPanel = () => {
  const { t } = useTranslation('about');
  return (
    <Box sx={{width: '100%', height: '650px'}}>
      <Box sx={{width: '100%', height: '700px', display: 'flex', justifyContent: 'left', alignItems: 'center'}}>
        <Box sx={{position: 'absolute', top: '0', left: '0', opacity: '0.5', zIndex: '-5'}}>
        <img src={HeroLeft} alt="Shadow woman dancing" width="100%"/>
        </Box>
       <Box sx={{ml: '30px', width: '100%', height: '650px', display:'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start'}}>
        <Box sx={{width: '50%', height: '500px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', ml: '2rem'}}>
        <Typography component="h2" variant="h2">
            {t('What is this?')}
          </Typography>
        <h3>Watch, listen or read content about the arts and cultures<br></br>across Turtle Island - Canada</h3>
        <Button>Start Watching</Button>
        </Box>
        <ReactPlayer
        url="https://vimeo.com/243556536"
        width="40%"
        height="400px"
        playing
        playIcon={<Box sx={{paddingLeft: '1rem'}}><Typography component="h2" variant="h2">
        {t('Creator?')}</Typography><p>Learn how to become a creator and use the platform</p><Button>Play</Button></Box>}
        light={HeroRight}
        />
        </Box>
        </Box>
      </Box>
  );
};

// const HeroPanel = () => {
//   const { t } = useTranslation('about');
//   return (
//     <Box pb="5rem">
//       <AboutPanel
//         textContent={
//           <Box pl="10rem">
//             <Trans i18nKey="heroText">
//               <p>
//                 Cube aggregates audio, video and virtual programming produced by
//                 arts organizations from across Canada. Created through
//                 collaboration, Cube is dedicated to the accessibility and
//                 discoverability of educational, art and cultural content online.
//               </p>
//               <p>
//                 Search content by region, material or maker, direct message
//                 Canada’s art organizations about the content you would like to
//                 experience, and support content collaborations looking for
//                 funding.
//               </p>
//               <p>
//                 To learn more about what to expect as a user or creator on Cube,
//                 play the videos to the right of this text.
//               </p>
//             </Trans>
//             <MediaPlayer
//               url="https://storage.googleapis.com/media-session/elephants-dream/the-wires.mp3"
//               isAudio
//             />
//             <Box py="2rem">
//               <Button>{t('Start watching', { ns: 'common' })}</Button>
//             </Box>
//           </Box>
//         }
        // imageContent={
        //   <Stack direction="column" justifyContent="center" alignItems="center">
        //     <Stack direction="row" justifyContent="center" pb="2rem">
        //       <img src={HeroLeft} alt="" />
        //       <img src={HeroRight} alt="" />
        //     </Stack>
        //     <img src={CubeDao} alt="" width="400" />
        //   </Stack>
//         }
//       />
//     </Box>
//   );
// };

export default HeroPanel;
