import { Box, Typography, useTheme } from '@mui/material';
import Button from 'components/Button';
import { useTranslation } from 'react-i18next';

const Accessibility = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Box className={'upload__accessibility-screen'}>
      <Typography component="h2" variant="h2">
        {t('Accessibility')}
      </Typography>

      <Box my={theme.spacing(5)}>
        <Typography component="h5" variant="h5">
          {t('Add a Sign-language Option To Your Video')}
        </Typography>
        <Typography component="p" my={theme.spacing(2.5)}>
          {t(
            'We encourage everyone to add sign language to their video content. Cube has a partnership with Deaf Spectrum who is able to book Signers willing to be videoed for content online. This does not need to be uploaded at the same time your content is. If you book using the button here, which is a portal to Deaf Spectrum’s site, signers are given the time they need to produce video content and the video is added later as a picture on picture option for users who select it.'
          )}
        </Typography>
        <Button>{t('Book with Deaf Spectrum')}</Button>
      </Box>
    </Box>
  );
};

export default Accessibility;
