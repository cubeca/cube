import { Box, Button, Typography } from '@mui/material';
import MediaPlayer from 'components/MediaPlayer';
import { Trans, useTranslation } from 'react-i18next';
import ThumbnailGrid from '../ThumbnailGrid';
import { Gradient } from '@mui/icons-material';

import * as s from './DaoPanel.styled';

const DaoPanel = () => {
  const { t } = useTranslation('about');
  return (
   
          <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'center', backgroundColor: 'rgba(40,52,60,0.7)', pb:'5rem', width: '100vw'}}>
          <ThumbnailGrid></ThumbnailGrid>
          <Trans i18nKey="daoText">
          <Box sx={{display: 'flex', flexDirection: 'column', p: '2rem', marginTop: '20vh'}}>
          <Typography component="h2" variant="h4">We are a DAO</Typography>
          <Typography component="p" variant="body2">
              A DAO is a decentralized autonomous organization; made possible by
              blockchain technology. Cube operates like a DAO while
              fulfilling the requirements of a not-for-profit. This means that
              all content creators on Cube are collective owners of this platform. Cube does not produce a publicly traded token, only an
              internal governance token that Cube creators earn for uploading
              free, accessible content. They use their governance tokens to vote
              on improvements to the site and the managing of Cube’s assets. By
              using an on-chain voting system we make these decisions public.
            </Typography>
            <MediaPlayer
            url="https://storage.googleapis.com/media-session/elephants-dream/the-wires.mp3"
            isAudio
          />
          <Box py="2rem">
            <Button sx={{backgroundColor: "#95f5cb", color: '#57838B'}}>{t('Howe It Works', { ns: 'common' })}</Button>
          </Box>
</Box>
          </Trans>
<Box sx={{display: 'flex', flexDirection: 'column'}}>
          <Box sx={{height: '350px', width: '100%'}}></Box>
          <ThumbnailGrid></ThumbnailGrid>
          </Box>
          </Box>
         
  ); 
};

export default DaoPanel;
