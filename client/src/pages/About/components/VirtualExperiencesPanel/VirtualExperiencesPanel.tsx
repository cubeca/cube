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
          alignItems="center"
          justifyContent="center"
          sx={{backgroundColor: '#95f5cb', padding:'5vw'}}
        >
          <Typography component="h2" variant="h2" textAlign={{sx: 'center', sm: 'center', md: 'right'}} paddingRight={{md: '1rem'}}>
            {t('We Are A Commons')}
          </Typography>
          <Typography component="p" textAlign={{sx: 'center', sm: 'center', md: 'right'}} padding={{xs: '1.5rem', sm: '2rem', md: '1rem'}}>
            {t('creatorsText')}
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
