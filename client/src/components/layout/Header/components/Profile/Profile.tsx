import { Button } from '@mui/material';
import { Box } from '@mui/system';
import ProfileMenu from './ProfileMenu';
import { useContext, useState } from 'react';
import useProfile from 'hooks/useProfile';
import { useTranslation } from 'react-i18next';
import FPOProfileUrl from 'assets/images/profile-user-image.png';
import * as s from './Profile.styled';
import { UserContext } from 'providers/UserProvider';

const Profile = () => {
  const { t } = useTranslation();
  const { data: profile, isLoading } = useProfile();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { user } = useContext(UserContext);

  console.log(user, profile)

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const menuId = 'profile-menu';

  // if (isLoading) {
  //   return <Box>Loading...</Box>;
  // }

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
              <img
                src={profile.logoUrl || FPOProfileUrl}
                alt="profile thumbnail"
              />
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
      />
    </Box>
  );
};

export default Profile;
