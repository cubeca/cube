import { Stack, Box, Typography } from '@mui/material';
import { ReactComponent as CubeLogo } from 'assets/icons/cube.svg';
import NavPanel from './components/NavPanel';
import Social from './components/Social';
import { useTranslation } from 'react-i18next';
import TextInput from 'components/form/TextInput';
import { ReactComponent as CreditsImg } from 'assets/icons/footer-credits.svg';
import * as s from './Footer.styled';

const Footer = () => {
  const { t } = useTranslation('about');

  return (
    <Stack
      component="footer"
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      p="60px 8.333333333333333%"
      sx={{ backgroundColor: 'rgba(87, 131, 139, 0.15)' }}
    >
      <Box sx={{ width: '40%' }}>
        <Typography component="h4" variant="h4">
          {t('Sign Up For Updates')}
        </Typography>

        <Typography component="p" variant="body2">
          {t(
            'Our emails are few and far between with occasional content teasers and NFT releases.'
          )}
        </Typography>

        <CreditsImg />
      </Box>

      <Box py="2rem">
        <NavPanel></NavPanel>
      </Box>
      <Social />
    </Stack>
  );
};

export default Footer;
