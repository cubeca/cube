import { Box, Link, Stack, Typography } from '@mui/material';
import MediaPlayer from 'components/MediaPlayer';
import { Trans, useTranslation } from 'react-i18next';
import SignLanguageIcon from '@mui/icons-material/SignLanguage';
import SubtitlesIcon from '@mui/icons-material/Subtitles';
import ClosedCaptionIcon from '@mui/icons-material/ClosedCaption';
import HearingIcon from '@mui/icons-material/Hearing';

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
                Cube advocates for accessibility standards from which further
                efforts can be made and developed as technology improves. We aim
                to be a tool that supports the accessibility of online arts and
                cultural content, and to be a point of connection to Canadian
                organizations like <Link href="#">Deaf Spectrum</Link> and
                <Link href="#">OAFAC</Link>.
              </Typography>
            </Trans>
            <MediaPlayer
          url="https://storage.googleapis.com/media-session/elephants-dream/the-wires.mp3"
          isAudio
          width="90%"
        />
          </Box>
   
      <Stack direction="row" justifyContent="center" spacing={15} pt="2vw">
       
        <Stack alignItems="center">
          <SignLanguageIcon sx={{ paddingBottom: '0.5rem' }} />
          {t('Sign Language')}
        </Stack>
        <Stack alignItems="center">
          <SubtitlesIcon sx={{ paddingBottom: '0.5rem' }} />
          {t('Subtitles')}
        </Stack>
        <Stack alignItems="center">
          <ClosedCaptionIcon sx={{ paddingBottom: '0.5rem' }} />
          {t('Close Captioning')}
        </Stack>
        <Stack alignItems="center">
          <HearingIcon sx={{ paddingBottom: '0.5rem' }} />
          {t('Audio Transcripts')}
        </Stack>
      </Stack>
    </Box>
  );
};

export default AccessibilityPanel;
