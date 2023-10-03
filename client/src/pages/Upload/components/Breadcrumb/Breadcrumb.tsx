import { Button, Typography } from '@mui/material';
import Grid from '@mui/system/Unstable_Grid';
import * as s from './Breadcrumb.styled';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from 'providers/UserProvider';
import { getProfileId } from 'utils/auth';
import { getProfile } from 'api/profile';
import useProfile from 'hooks/useProfile';
import useAuth from 'hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Breadcrumb = () => {
  const { user } = useContext(UserContext);
  const [tag, setTag] = useState('');
  const profileId = getProfileId();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { data: profile} = useProfile(tag);

  useEffect(() => {
    const getTag = async () => {
      try {
        const { data } = await getProfile((user as any)?.profile_id || profileId)
        setTag((data as any).tag)
      } catch(e: any) {
        logout();
        navigate('/login?error=invalidToken');
      }
    }
    getTag()
  }, [])

  return (
    <s.BreadcrumbWrapper>
      <Grid container>
        <Grid xs={10} xsOffset={1}>
          <s.Breadcrumb className={'upload__breadcrumb'}>
            <li>
              {profileId && profile && (
                <Button 
                  variant="contained"
                  onClick={ () => navigate(`/profile/${profile.tag}`) }
                >My Profile</Button>
              )}
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
