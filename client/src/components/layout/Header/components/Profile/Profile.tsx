import { Button } from '@mui/material';
import { Box } from '@mui/system';
import ProfileMenu from './ProfileMenu';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Lottie from 'lottie-react';
import LoadingCircle from 'assets/animations/loading-circle.json';
import * as s from './Profile.styled';
import { UserContext } from 'providers/UserProvider';
import { getProfileId } from 'utils/auth';
import { getProfile } from 'api/profile';
import { BFFGetProfileByTagData } from '@cubeca/bff-client-oas-axios';
import { useNavigate } from 'react-router-dom';
import useAuth from 'hooks/useAuth';
import useProfile from 'hooks/useProfile';

const Profile = () => {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { user } = useContext(UserContext);
  const [tag, setTag] = useState('')
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

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const menuId = 'profile-menu';

  let username = t('Profile')
  if(user && !user.permission_ids.includes('contentEditor')) {
    username = user.name.split(' ')[0]
  }

  return (
    <Box>
      <Button
        onClick={handleMenuOpen}
        aria-controls={open ? menuId : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        sx={{ padding: '10px 20px' }}
      >
        <Box display="flex" justifyContent="center" alignItems="center">
          <s.ImageWrapper>
            <s.ImageInner>
              {profile.logoUrl && <img src={profile!.logoUrl} alt='user profile thumbnail' />}
              {!profile && <Lottie
                className="loading-circle"
                animationData={LoadingCircle}
                loop={true}
                autoplay={true}
              />}
            </s.ImageInner>
          </s.ImageWrapper>
          <Box component="span" pl="10px">
            {username}
          </Box>
        </Box>
      </Button>
      <ProfileMenu
        open={open}
        anchorEl={anchorEl}
        onClose={handleMenuClose}
        id={menuId}
        profile={profile as BFFGetProfileByTagData}
        profileId={profileId || ''}
      />
    </Box>
  );
};

export default Profile;
