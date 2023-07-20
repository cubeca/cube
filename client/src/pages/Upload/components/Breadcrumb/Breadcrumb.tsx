import { Button, Typography } from '@mui/material';
import Grid from '@mui/system/Unstable_Grid';
import * as s from './Breadcrumb.styled';

const Breadcrumb = () => {
  return (
    <s.BreadcrumbWrapper>
      <Grid container>
        <Grid xs={10} xsOffset={1}>
          <s.Breadcrumb className={'upload__breadcrumb'}>
            <li>
              <Button variant="contained">Dashboard</Button>
            </li>
            <li>
              <Typography variant="body2">Upload new media</Typography>
            </li>
          </s.Breadcrumb>
        </Grid>
      </Grid>
    </s.BreadcrumbWrapper>
  );
};

export default Breadcrumb;
