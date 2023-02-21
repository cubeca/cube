import { Grid, Box, Button, Typography } from '@mui/material';
import MediaPlayer from 'components/MediaPlayer';
import { Trans, useTranslation } from 'react-i18next';
import ThumbnailGrid from '../ThumbnailGrid';

import * as s from './DaoPanel.styled';

const DaoPanel = () => {
  const { t } = useTranslation('about');
  return (

    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', pt: { xs: '0', md: '5rem' }, backgroundImage: 'linear-gradient(rgba(40,52,60,0),rgba(40,52,60,1), rgba(40,52,60,1), rgba(40,52,60,1),rgba(40,52,60,1), rgba(40,52,60,1))', pb: '5rem', width: '100vw' }}>
      <Grid
        container
        spacing={0}
        marginTop={'2vh'}
        columnGap="none"
        xs={12} md={12}
        flex-direction={{ xs: 'column', sm: 'column', md: 'row' }}
      >
        <Grid item xs={12} md={5}>
          <ThumbnailGrid></ThumbnailGrid>
        </Grid>
        <Grid item xs={12} md={7}>
          <Trans i18nKey="daoText">
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'flex-end', md: 'flex-start' }, pl: { xs: '0rem', md: '6rem' }, pr: { xs: '2rem', md: '0rem' }, marginTop: { xs: '10vh', md: '20vh' } }}>
              <Typography component="h2" variant="h4">We are a DAO</Typography>
              <Typography component="p" variant="body2" sx={{ maxWidth: '75%', textAlign: { xs: 'end', md: 'start' } }}>
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
                <Button sx={{ backgroundColor: "#95f5cb", color: '#57838B' }}>{t('Howe It Works', { ns: 'common' })}</Button>
              </Box>
            </Box>
          </Trans>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DaoPanel;
