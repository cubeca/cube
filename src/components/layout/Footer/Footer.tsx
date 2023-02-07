import { Stack, Box } from '@mui/material';
import { ReactComponent as CubeLogo } from 'assets/icons/cube-inverted-bw.svg';
import NavPanel from './components/NavPanel';
import Social from './components/Social';
import { TFunction, useTranslation } from 'react-i18next';

const Footer = () => (
  <Stack
    component="footer"
    direction="row"
    justifyContent="space-between"
    alignItems="center"
    p="5rem"
    sx={{ backgroundColor: '#75d6c1' }}
  >
    <Box sx={{width: '40%'}}>
      <p>Sign Up For Updates</p>
      <p>This will mean NFT releases as well as the odd newsletter about new content</p>
      <CubeLogo />
    </Box>
    
    <Box py="2rem">
      <NavPanel></NavPanel>
    </Box>
    <Social />
  </Stack>
);

export default Footer;
