import { Box, Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import AboutPanel from '../AboutPanel';
import CollaborationsHero from 'assets/images/collaborations.jpg';
import MediaPlayer from 'components/MediaPlayer';

const CollaborationsPanel = () => {
  const { t } = useTranslation('about');
  return (
    <AboutPanel
      textContent={
        <Box px="10rem">
          <Typography component="h2" variant="h2">
            {t('collaborations')}
          </Typography>
          <Typography component="p" sx={{ padding: '1.5rem 0' }}>{t('collaborationsText')}</Typography>
          <MediaPlayer
            url="https://storage.googleapis.com/media-session/elephants-dream/the-wires.mp3"
            isAudio
          />
          <Box py="2rem">
            <Button>
              {t('Become a content creator', { ns: 'common' })}
            </Button>
          </Box>
        </Box>
      }
      imageContent={
        <Box>
          <img src={CollaborationsHero} alt="" />
        </Box>
      }
    />
  );
};

export default CollaborationsPanel;
