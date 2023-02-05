import { Box, Stack } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';
import AboutPanel from '../AboutPanel';
import HeroLeft from 'assets/images/cubedao-hero-left.png';
import HeroRight from 'assets/images/cubedao-hero-right.png';
import CubeDao from 'assets/images/cubedao.png';
import MediaPlayer from 'components/MediaPlayer';
import Button from 'components/Button';

const HeroPanel = () => {
  const { t } = useTranslation('about');
  return (
    <Box pb="5rem">
      <AboutPanel
        textContent={
          <Box pl="10rem">
            <Trans i18nKey="heroText">
              <p>
                Cube aggregates audio, video and virtual programming produced by
                arts organizations from across Canada. Created through
                collaboration, Cube is dedicated to the accessibility and
                discoverability of educational, art and cultural content online.
              </p>
              <p>
                Search content by region, material or maker, direct message
                Canada’s art organizations about the content you would like to
                experience, and support content collaborations looking for
                funding.
              </p>
              <p>
                To learn more about what to expect as a user or creator on Cube,
                play the videos to the right of this text.
              </p>
            </Trans>
            <MediaPlayer
              url="https://storage.googleapis.com/media-session/elephants-dream/the-wires.mp3"
              isAudio
            />
            <Box py="2rem">
              <Button>{t('Start watching', { ns: 'common' })}</Button>
            </Box>
          </Box>
        }
        imageContent={
          <Stack direction="column" justifyContent="center" alignItems="center">
            <Stack direction="row" justifyContent="center" pb="2rem">
              <img src={HeroLeft} alt="" />
              <img src={HeroRight} alt="" />
            </Stack>
            <img src={CubeDao} alt="" width="400" />
          </Stack>
        }
      />
    </Box>
  );
};

export default HeroPanel;
