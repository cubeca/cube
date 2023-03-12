import { Stack } from '@mui/material';
import Grid from '@mui/system/Unstable_Grid';

const Screens = ({ screen }: any) => {
  return (
    <Stack className={'upload__screens'}>
      <Grid container>
        <Grid xs={10} xsOffset={1} md={6} mdOffset={3}>
          {screen}
        </Grid>
      </Grid>
    </Stack>
  );
};

export default Screens;
