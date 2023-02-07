import { Stack } from '@mui/material';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';

import * as s from '../NavPanel/NavPanel.styled';

const Social = () => (
  <Stack direction="column" spacing={5} justifyContent="center" py="2rem">
    <s.NavLink to="/login">Login</s.NavLink>
    <TwitterIcon />
    <InstagramIcon />  
  </Stack>
);

export default Social;
