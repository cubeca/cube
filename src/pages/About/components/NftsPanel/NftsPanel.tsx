import { Box, Stack, Typography } from '@mui/material';
import MediaPlayer from 'components/MediaPlayer';
import { Trans, useTranslation } from 'react-i18next';
import AboutPanel from '../AboutPanel';

const NftsPanel = () => {
  const { t } = useTranslation('about');
  return (
    <AboutPanel
      textContent={
        <Box px="10rem">
          <Trans i18nKey="nftsText">
            <p>
              We could not hang out with all these great artists and art
              organizations and not make art! While we are not an NFT
              marketplace, we do subsidize gas and other minting fees for
              artists collaborating with organizations to produce an NFT. The
              sale and re-sale of these NFTs online, automatically sends profits
              back to the artists, the organizations and Cube to help create
              another avenue toward sustainability.
            </p>
            <p>
              For decades artists have been producing limited edition multiples
              for galleries to sell as part of their funding model. However, the
              sale and resale of these works has not provided income for their
              artists. We look to blockchain to improve the equity of these
              collaborations with organizations, and to help artists into a new
              medium for their work.
            </p>
          </Trans>
        </Box>
      }
      imageContent={
        <Stack
          justifyContent="space-between"
          alignItems="center"
          height="100%"
          pb="6rem"
        >
          <Typography component="h2" variant="h2">
            {t('NFTs', { ns: 'common' })}
          </Typography>
          <MediaPlayer
            url="https://storage.googleapis.com/media-session/elephants-dream/the-wires.mp3"
            isAudio
          />
        </Stack>
      }
    />
  );
};

export default NftsPanel;
