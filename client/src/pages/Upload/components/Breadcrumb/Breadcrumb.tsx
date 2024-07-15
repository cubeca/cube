/**
 * `Breadcrumb` renders a breadcrumb style navigation for the upload process.
 * It displays a link to the user's profile and either "Upload new media" or "Edit content" depending on the `editMode` prop.
 * @param {boolean} [editMode=false] Indicates whether the breadcrumb is being used in edit mode.
 * This changes the displayed text to either "Upload new media" or "Edit content".
 */

import { Button, Typography } from '@mui/material';
import Grid from '@mui/system/Unstable_Grid';
import * as s from './Breadcrumb.styled';
import { getProfileTag } from 'utils/auth';
import { useNavigate } from 'react-router-dom';
interface BreadcrumbProps {
  editMode?: boolean;
}

const Breadcrumb = ({ editMode }: BreadcrumbProps) => {
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
              {!editMode ? (
                <Typography variant="body2">Upload new media</Typography>
              ) : (
                <Typography variant="body2">Edit content</Typography>
              )}
            </li>
          </s.Breadcrumb>
        </Grid>
      </Grid>
    </s.BreadcrumbWrapper>
  );
};

export default Breadcrumb;
