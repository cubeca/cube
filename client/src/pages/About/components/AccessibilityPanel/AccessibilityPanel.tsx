import { Box, Link, Stack, Typography } from '@mui/material';
import MediaPlayer from 'components/MediaPlayer';
import { Trans, useTranslation } from 'react-i18next';
import AboutPanel from '../AboutPanel';
import SignLanguageIcon from '@mui/icons-material/SignLanguage';
import SubtitlesIcon from '@mui/icons-material/Subtitles';
import ClosedCaptionIcon from '@mui/icons-material/ClosedCaption';
import HearingIcon from '@mui/icons-material/Hearing';

const AccessibilityPanel = () => {
  const { t } = useTranslation('about');
  return (
    <Box pb="10rem">
      <AboutPanel
        textContent={
          <Box px="10rem">
            <Typography component="h2" variant="h2">
              {t('accessibility')}
            </Typography>
            <Trans i18nKey="accessibilityText">
              <Typography component="p">
                Cube advocates for accessibility standards from which further
                efforts can be made and developed as technology improves. We aim
                to be a tool that supports the accessibility of online arts and
                cultural content, and to be a point of connection to Canadian
                organizations like <Link href="#">Deaf Spectrum</Link> and
                <Link href="#">OAFAC</Link>.
              </Typography>
            </Trans>
          </Box>
        }
      />
      <Stack direction="row" spacing={10} pl="10rem">
        <MediaPlayer
          url="https://storage.googleapis.com/media-session/elephants-dream/the-wires.mp3"
          isAudio
          width="30%"
        />
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
