import { Box, Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import AboutPanel from '../AboutPanel';
import VirtualExperiencesHero from 'assets/images/virtualExperiences.jpg';
import MediaPlayer from 'components/MediaPlayer';

const VirtualExperiencesPanel = () => {
  const { t } = useTranslation('about');
  return (
    <AboutPanel
      textContent={
        <Box pr="10rem">
          <Typography component="h2" variant="h2">
            {t('virtualExperiences')}
          </Typography>
          <Typography component="p" sx={{ padding: '1.5rem 0' }}>
            {t('virtualExperiencesText')}
          </Typography>
          <MediaPlayer
            url="https://storage.googleapis.com/media-session/elephants-dream/the-wires.mp3"
            isAudio
          />
          <Box py="2rem">
            <Button variant="contained">{t('Enquire about event')}</Button>
          </Box>
        </Box>
      }
      imageContent={
        <Box sx={{ display: 'flex', justifyContent: 'right' }}>
          <img src={VirtualExperiencesHero} alt="" />
        </Box>
      }
      isReversed
    />
  );
};

export default VirtualExperiencesPanel;
