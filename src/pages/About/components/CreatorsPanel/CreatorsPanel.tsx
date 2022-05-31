import { Box, Button, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import AboutPanel from '../AboutPanel';
import CreatorsHero from 'assets/images/creators.jpg';
import MediaPlayer from 'components/MediaPlayer';

const CreatorsPanel = () => {
  const { t } = useTranslation('about');
  return (
    <AboutPanel
      textContent={
        <Stack
          px="10rem"
          alignItems="flex-end"
          justifyContent="center"
          sx={{ textAlign: 'right' }}
        >
          <Typography component="h2" variant="h2">
            {t('creators')}
          </Typography>
          <Typography component="p" sx={{ padding: '1.5rem 0' }}>
            {t('creatorsText')}
          </Typography>
          <MediaPlayer
            url="https://storage.googleapis.com/media-session/elephants-dream/the-wires.mp3"
            isAudio
          />
          <Box py="2rem">
            <Button variant="contained">
              {t('Become a content creator', { ns: 'common' })}
            </Button>
          </Box>
        </Stack>
      }
      imageContent={
        <Box>
          <img src={CreatorsHero} alt="" />
        </Box>
      }
    />
  );
};

export default CreatorsPanel;
