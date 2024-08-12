import { Button } from '@mui/material';
import { Box } from '@mui/system';
import ProfileMenu from './ProfileMenu';
import { useState } from 'react';
import Lottie from 'lottie-react';
import LoadingCircle from 'assets/animations/loading-circle.json';
import * as s from './Profile.styled';
import { getProfileId, getProfileTag, getUser } from 'utils/auth';
import { GetProfileByTagData } from '@cubeca/cube-svc-client-oas-axios';
import useProfile from 'hooks/useProfile';

const Profile = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const profileId = getProfileId();
  const { data: profile } = useProfile(getProfileTag());

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const menuId = 'profile-menu';
  const username = getUser()?.name.split(' ')[0] || '';

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
          {profileId !== null && (
            <s.ImageWrapper>
              <s.ImageInner>
                {profile.logoUrl && (
                  <img src={profile!.logoUrl} alt="user profile thumbnail" />
                )}
                {!profile && (
                  <Lottie
                    className="loading-circle"
                    animationData={LoadingCircle}
                    loop={true}
                    autoplay={true}
                  />
                )}
              </s.ImageInner>
            </s.ImageWrapper>
          )}
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
        profile={profile as GetProfileByTagData}
        profileId={profileId || ''}
      />
    </Box>
  );
};

export default Profile;
