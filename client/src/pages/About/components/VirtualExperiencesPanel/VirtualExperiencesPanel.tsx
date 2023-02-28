import { Box, Typography, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import AboutPanelLeft from '../../../../components/AboutPanelLeft/index';
import MediaPlayer from 'components/MediaPlayer';
import Button from 'components/Button';

import * as s from './VirtualExperiencesPanel.styled';

const VirtualExperiencesPanel = () => {
  const { t } = useTranslation('about');
  return (
    <AboutPanelLeft
    imageContent={
      <s.VRCover>
      </s.VRCover>
  }
      textContent={
        <Stack
          alignItems="enter"
          sx={{backgroundColor: '#95f5cb', padding:'5vw', justifyContent: {xs: 'center', sm: 'center', md: 'left'}}}
        >
          <Typography component="h2" variant="h2" color="#28343C" textAlign={{xs: 'center', sm: 'center', md: 'left'}} padding={{xs: '1.5rem', sm: '2rem', md: '1rem'}}>
            {t('Want to build an exhibition in VR ?')}
          </Typography>
          <Typography component="p" color="#28343C" textAlign={{xs: 'center', sm: 'center', md: 'left'}} padding={{xs: '1.5rem', sm: '2rem', md: '1rem'}} marginBottom="1.25rem">
            {t('Cube Commons own a plat in the popular, artworld of Cryptovoxels. This virtual neighbourhood of artist-run and institutional spaces already has a built in community. It is also free to access by your patrons, and easily accesses as there is no login requires. ')}
          </Typography>
          <MediaPlayer
            url="https://storage.googleapis.com/media-session/elephants-dream/the-wires.mp3"
            isAudio
          />
          <Box pt="2rem">
            <Button>
              {t('Join US', { ns: 'common' })}
            </Button>
          </Box>
        </Stack>
      }
    />
  );
};
//   const { t } = useTranslation('about');
//   return (
//     <AboutPanel
//       textContent={
//         <Box pr="5rem">
//           <Typography component="h2" variant="h2">
//             {t('virtualExperiences')}
//           </Typography>
//           <Typography component="p" sx={{ padding: '1.5rem 0' }}>
//             {t('virtualExperiencesText')}
//           </Typography>
//           <MediaPlayer
//             url="https://storage.googleapis.com/media-session/elephants-dream/the-wires.mp3"
//             isAudio
//           />
//           <Box py="2rem">
//             <Button>{t('Enquire about event')}</Button>
//           </Box>
//         </Box>
//       }
//       imageContent={
//         <Box sx={{ display: 'flex', justifyContent: 'right' }}>
//           <img src={VirtualExperiencesHero} alt="" />
//         </Box>
//       }
//       isReversed
//     />
//   );
// };

export default VirtualExperiencesPanel;
