import { Box, Link, Stack, Typography } from '@mui/material';
import Grid from '@mui/system/Unstable_Grid';
import MediaPlayer from 'components/MediaPlayer';
import { Trans, useTranslation } from 'react-i18next';
import SignLanguageIcon from '@mui/icons-material/SignLanguage';
import VoiceChatIcon from '@mui/icons-material/VoiceChat';
import SubtitlesIcon from '@mui/icons-material/Subtitles';
import * as s from './AccessibilityPanel.styled';

const AccessibilityPanel = () => {
  const { t } = useTranslation('about');
  return (
    <s.AccessibilityPanel>
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
        <Typography component="h3" variant="h3" textAlign="center" lang="fr">
          {t('accessibilityFR')}
        </Typography>
        <Grid container justifyContent="center">
          <Grid xs={12} md={4} padding="1rem">
            <Typography component="p" variant="body1" textAlign="center">
              {t('accessibilityText')}
            </Typography>
          </Grid>
          <Grid xs={12} md={4} padding="1rem">
            <Typography component="p" variant="body1" textAlign="center" lang="fr">
              {t('accessibilityTextFR')}
            </Typography>
          </Grid>
        </Grid>
        <Typography
          component="p"
          sx={{
            textAlign: 'center',
            maxWidth: '720px',
            margin: '0 auto'
          }}
        >
          {' '}
          <a
            href="https://deafspectrum.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-link"
          >
            Deaf Spectrum
          </a>{' '}
          +{' '}
          <a
            href="https://openaccessfoundation.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-link"
          >
            OAFAC
          </a>
        </Typography>
      </Box>

      <Grid container>
        <Grid xs={12} md={2} mdOffset={3}>
          <s.IconDefinition alignItems="center">
            <SignLanguageIcon />
            <Typography component="p" variant="body2">
              {t('Sign Language')}
            </Typography>
            <Typography component="p" variant="body2" lang="fr">
              {t('Langage des Signes')}
            </Typography>
          </s.IconDefinition>
        </Grid>
        <Grid xs={12} md={2}>
          <s.IconDefinition alignItems="center">
            <VoiceChatIcon />
            <Typography component="p" variant="body2">
              {t('Text to Speech')}
            </Typography>
            <Typography component="p" variant="body2" lang="fr">
              {t('Texte pour Parler')}
            </Typography>
          </s.IconDefinition>
        </Grid>
        <Grid xs={12} md={2}>
          <s.IconDefinition alignItems="center">
            <SubtitlesIcon />
            <Typography component="p" variant="body2">
              {t('Subtitles')}
            </Typography>
            <Typography component="p" variant="body2" lang="fr">
              {t('Sous-titres')}
            </Typography>
          </s.IconDefinition>
        </Grid>
      </Grid>
    </s.AccessibilityPanel>
  );
};

export default AccessibilityPanel;
