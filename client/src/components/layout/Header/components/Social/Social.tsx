import { Stack } from '@mui/material';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LanguageIcon from '@mui/icons-material/Language';

const Social = () => (
  <Stack
    direction="row"
    spacing={3}
    justifyContent="flex-end"
    sx={{ padding: '1rem', paddingRight: '5rem' }}
  >
    <TwitterIcon />
    <InstagramIcon />
    <LanguageIcon />
  </Stack>
);

export default Social;
