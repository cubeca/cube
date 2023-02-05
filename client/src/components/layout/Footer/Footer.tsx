import { Stack, Box } from '@mui/material';
import { ReactComponent as CubeLogo } from 'assets/icons/cube-inverted-bw.svg';
import NavPanel from './components/NavPanel';
import Social from './components/Social';

const Footer = () => (
  <Stack
    component="footer"
    alignItems="center"
    sx={{ borderTop: 'solid 1px #ffffff' }}
  >
    <Box py="3rem">
      <CubeLogo />
    </Box>
    <NavPanel />
    <Box py="2rem">
      Supported by Canada Council for Arts Digital Strategy Fund Design by
      Chantal Adolphe (www.chantaladolphe.com){' '}
    </Box>
    <Social />
  </Stack>
);

export default Footer;
