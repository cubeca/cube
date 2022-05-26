import { Stack } from '@mui/material';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';

const Social = () => (
  <Stack direction="row" spacing={10} justifyContent="center" py="5rem">
    <TwitterIcon />
    <InstagramIcon />
  </Stack>
);

export default Social;
