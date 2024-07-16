import Grid from '@mui/system/Unstable_Grid';
import * as s from './Screens.styled';

const Screens = ({ screen }: any) => {
  return (
    <s.FormTypography className={'upload__screens'}>
      <Grid container>
        <Grid xs={10} xsOffset={1} md={6} mdOffset={3}>
          {screen}
        </Grid>
      </Grid>
    </s.FormTypography>
  );
};

export default Screens;
