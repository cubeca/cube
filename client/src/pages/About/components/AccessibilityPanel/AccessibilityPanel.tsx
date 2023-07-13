import { Box, Link, Stack, Typography } from '@mui/material';
import MediaPlayer from 'components/MediaPlayer';
import { Trans, useTranslation } from 'react-i18next';
import Sign from 'assets/icons/signlanguage.svg';
import TexttoSpeech from 'assets/icons/text-to-speech.svg';
import CC from 'assets/icons/closed-captioning.svg';
import * as s from './AccessibilityPanel.styled';

const AccessibilityPanel = () => {
  const { t } = useTranslation('about');
  return (
    <Box sx={{ p: '120px 8.333333333333333%' }}>
      <Box
        px="5vw"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          paddingBottom: '60px'
        }}
      >
        <Typography component="h2" variant="h2" textAlign="center">
          {t('accessibility')}
        </Typography>
        {/* <Trans i18nKey="accessibilityText"> */}
          <Typography
            component="p"
            sx={{
              textAlign: 'center',
              maxWidth: '720px',
              margin: '0 auto',
            }}
          >
            CubeCommons advocates for accessibility standards from which further efforts can be made and developed as technology improves. We aim to be a tool that supports the accessibility of online arts and cultural content, and to be a point of connection to Canadian organizations like <a href="https://deafspectrum.com/" target="_blank" rel="noopener noreferrer" style={{padding: 0}} className="css-1mo7lgz">Deaf Spectrum</a> and <a href="https://openaccessfoundation.org/" target="_blank" rel="noopener noreferrer" style={{padding: 0}} className="css-1mo7lgz">OAFAC</a>.
          </Typography>
        {/* </Trans> */}
        {/* <MediaPlayer
          url="https://storage.googleapis.com/media-session/elephants-dream/the-wires.mp3"
          isAudio
        /> */}
      </Box>

      <s.IconsRow direction="row" justifyContent="center" spacing={15}>
        <s.IconDefinition alignItems="center">
          <img src={Sign} alt="Sign Language symbol" />
          <Typography component="p" variant="body2">
            {t('Sign Language')}
          </Typography>
        </s.IconDefinition>
        <s.IconDefinition alignItems="center">
          <img src={TexttoSpeech} alt="Sign Language symbol" />
          <Typography component="p" variant="body2">
            {t('Text to Speech')}
          </Typography>
        </s.IconDefinition>
        <s.IconDefinition alignItems="center">
          <img src={CC} alt="Sign Language symbol" />
          <Typography component="p" variant="body2">
            {t('Closed Captioning')}
          </Typography>
        </s.IconDefinition>
      </s.IconsRow>
    </Box>
  );
};

export default AccessibilityPanel;
