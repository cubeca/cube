import { Stack, Grid } from '@mui/material';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';

import * as s from '../NavPanel/NavPanel.styled';

const Social = () => (
  <Stack direction="column" spacing={5} justifyContent="center" alignItems="center" py="2rem">
    <s.NavLink to="/login" textAlign="center">Login</s.NavLink>
  <Grid container xs={12} md={12}>
<Grid item p="5px">
<TwitterIcon />
</Grid>
<Grid item p="5px">
<InstagramIcon /> 
</Grid>
  </Grid>
  </Stack>
  // <Stack direction="column" spacing={5} justifyContent="center" py="2rem">
  //   <s.NavLink to="/login">Login</s.NavLink>
  //   <TwitterIcon />
  //   <InstagramIcon />  
  // </Stack>
);

export default Social;
