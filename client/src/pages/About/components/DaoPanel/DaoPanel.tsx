import { Box, Button, Typography } from '@mui/material';
import MediaPlayer from 'components/MediaPlayer';
import { Trans, useTranslation } from 'react-i18next';

import * as s from './DaoPanel.styled';

const DaoPanel = () => {
  const { t } = useTranslation('about');
  return (
    <s.AboutPanel
      textContent={
        <Box px="10rem">
          <Typography component="h2" variant="h2">
            {t('dao')}
          </Typography>
          <Trans i18nKey="daoText">
            <p>
              A DAO is a decentralized autonomous organization; made possible by
              the technology it is built on. Cube operates like a DAO while
              fulfilling the requirements of a not-for-profit. This means that
              all content creators on Cube are collective owners of the platform
              they share. Cube does not produce a publicly traded token, only an
              internal governance token that Cube creators earn for uploading
              free, accessible content. They use their governance tokens to vote
              on improvements to the site and the managing of Cube’s assets. By
              using the blockchain for voting we make these decisions publicly
              transparent.
            </p>
            <p>
              Cube, unlike other streaming platforms, does not sell your data.
              The art organizations here are dedicated to sustainable online
              ecosystems, that engage with audiences and creators in equitable
              ways.
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
    />
  );
};

export default DaoPanel;
