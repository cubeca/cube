import { Button, Typography } from '@mui/material';
import Grid from '@mui/system/Unstable_Grid';
import * as s from './Breadcrumb.styled';
import { getProfileTag } from 'utils/auth';
import { useNavigate } from 'react-router-dom';

const Breadcrumb = () => {
  const navigate = useNavigate();
  const profileTag = getProfileTag();

  return (
    <s.BreadcrumbWrapper>
      <Grid container>
        <Grid xs={10} xsOffset={1}>
          <s.Breadcrumb className={'upload__breadcrumb'}>
            <li>
              <Button
                variant="contained"
                onClick={() => navigate(`/profile/${profileTag}`)}
              >
                My Profile
              </Button>
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
