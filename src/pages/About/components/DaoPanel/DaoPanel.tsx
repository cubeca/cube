import { Box, Button, Typography } from '@mui/material';
import MediaPlayer from 'components/MediaPlayer';
import { Trans, useTranslation } from 'react-i18next';
import ThumbnailGrid from '../ThumbnailGrid';

import * as s from './DaoPanel.styled';

// const DaoPanel = () => {
//   const { t } = useTranslation('about');
//   return (
//     <s.AboutPanel
//       textContent={
//           <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
//           <ThumbnailGrid></ThumbnailGrid>
//           <Box sx={{display: 'flex', flexDirection: 'column', pl: '2rem'}}>
//           <Typography component="h2" variant="h2">
//             {t('dao')}
//           </Typography>
//           <Trans i18nKey="daoText">
//             <p>
//               A DAO is a decentralized autonomous organization; made possible by
//               the technology it is built on. Cube operates like a DAO while
//               fulfilling the requirements of a not-for-profit. This means that
//               all content creators on Cube are collective owners of the platform
//               they share. Cube does not produce a publicly traded token, only an
//               internal governance token that Cube creators earn for uploading
//               free, accessible content. They use their governance tokens to vote
//               on improvements to the site and the managing of Cube’s assets. By
//               using the blockchain for voting we make these decisions publicly
//               transparent.
//             </p>
//             <p>
//               Cube, unlike other streaming platforms, does not sell your data.
//               The art organizations here are dedicated to sustainable online
//               ecosystems, that engage with audiences and creators in equitable
//               ways.
//             </p>
//           </Trans>
//           <MediaPlayer
//             url="https://storage.googleapis.com/media-session/elephants-dream/the-wires.mp3"
//             isAudio
//           />
//           <Box py="2rem">
//             <Button>{t('Start watching', { ns: 'common' })}</Button>
//           </Box>
//           </Box>
//           <ThumbnailGrid background-color="blue"></ThumbnailGrid>
//           </Box>
//       }
//     />
//   );
// };

// export default DaoPanel;


const DaoPanel = () => {
  const { t } = useTranslation('about');
  return (
 
          <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
          <ThumbnailGrid></ThumbnailGrid>
          <Trans i18nKey="daoText">
          <Box sx={{display: 'flex', flexDirection: 'column', p: '2rem'}}>
            <h2>DAO</h2>
            <p>
              Cube Commons, is a streaming platform where you can discover all
              the video, audio, digital publications and workbooklests being produced by artists and arts organizations on Turtle Island 
              about the artistic and cultural practices on these lands and waters. Just by searching a name or medium you can create playlists for students, friends or just to have on while you cook.
              ways.
            </p>
            <MediaPlayer
            url="https://storage.googleapis.com/media-session/elephants-dream/the-wires.mp3"
            isAudio
          />
          <Box py="2rem">
            <Button sx={{backgroundColor: "#95f5cb", color: '#57838B'}}>{t('Howe It Works', { ns: 'common' })}</Button>
          </Box>
          <h2>We Are A DAO</h2>
          <p>
              A DAO is a decentralized autonomous organization; made possible by
              blockchain technology. Cube operates like a DAO while
              fulfilling the requirements of a not-for-profit. This means that
              all content creators on Cube are collective owners of this platform. Cube does not produce a publicly traded token, only an
              internal governance token that Cube creators earn for uploading
              free, accessible content. They use their governance tokens to vote
              on improvements to the site and the managing of Cube’s assets. By
              using an on-chain voting system we make these decisions public.
            </p>
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
