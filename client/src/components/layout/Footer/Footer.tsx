import { Stack, Box } from '@mui/material';
import { ReactComponent as CubeLogo } from 'assets/icons/cube.svg';
import NavPanel from './components/NavPanel';
import Social from './components/Social';
import { TFunction, useTranslation } from 'react-i18next';
import TextInput from 'components/form/TextInput';

const Footer = () => (
  <Stack
    component="footer"
    direction="row"
    justifyContent="space-between"
    alignItems="center"
    p="5rem 2rem 5rem 2rem"
    sx={{backgroundColor: 'rgba(87, 131, 139, 0.15)'}}
  >
    <Box sx={{width: '40%'}}>
      <p>Sign Up For Updates</p>
      <p>Our emails are few and far between with occasional content teasers and NFT releases.</p>
      <CubeLogo />
    </Box>
    
    <Box py="2rem">
      <NavPanel></NavPanel>
    </Box>
    <Social />
  </Stack>
);

export default Footer;