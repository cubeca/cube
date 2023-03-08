import { Box, Link, Stack, Typography } from '@mui/material';
import MediaPlayer from 'components/MediaPlayer';
import { Trans, useTranslation } from 'react-i18next';
import Sign from 'assets/icons/signlanguage.svg';
import TexttoSpeech from 'assets/icons/text-to-speech.svg';
import CC from 'assets/icons/closed-captioning.svg';

const AccessibilityPanel = () => {
  const { t } = useTranslation('about');
  return (
    <Box sx={{p: '10vw', width: '100vw'}}>
      
          <Box px="5vw" sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', paddingBottom: '5vw'}}>
            <Typography component="h2" variant="h2" textAlign="center">
              {t('accessibility')}
            </Typography>
            <Trans i18nKey="accessibilityText">
            <Typography component="p" sx={{ padding: '2rem', textAlign: 'center'}}>
            {t('accessibilityText')}
              </Typography>
            </Trans>
            {/* <MediaPlayer
          url="https://storage.googleapis.com/media-session/elephants-dream/the-wires.mp3"
          isAudio
          width="90%"
        /> */}
          </Box>
   
      <Stack direction="row" justifyContent="center" spacing={15} pt="2vw">
     
        <Stack alignItems="center">
        <img src={Sign} alt="Sign Language symbol"/>
        <Typography>{t('Sign Language')}</Typography>
        </Stack> 
        <Stack alignItems="center">
        <img src={TexttoSpeech} alt="Sign Language symbol"/>
        <Typography>{t('Text to Speech')}</Typography>
        </Stack>
        <Stack alignItems="center">
        <img src={CC} alt="Sign Language symbol"/>
        <Typography>{t('Closed Captioning')}</Typography>
        </Stack>
      </Stack>
    </Box>
  );
};

export default AccessibilityPanel;
