import { Menu } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ProfileMenuItem from './ProfileMenuItem';
import { getProfileId, removeAuthToken } from 'utils/auth';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountBoxIcon from '@mui/icons-material/AccountBox';

interface ProfileMenuProps {
  open: boolean;
  anchorEl: null | HTMLElement;
  onClose: () => void;
  id: string;
}

const ProfileMenu = ({ open, anchorEl, onClose, id }: ProfileMenuProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const profileId = getProfileId();

  const handleLogout = () => {
    removeAuthToken();
    navigate('/');
  };

  const handleMenuClick = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <Menu
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      id={id}
      MenuListProps={{
        'aria-labelledby': id
      }}
    >
      <ProfileMenuItem
        onClick={() => handleMenuClick(`/profile/${profileId}`)}
        text={t('My Profile')}
        icon={<AccountBoxIcon />}
      />
      <ProfileMenuItem
        onClick={handleLogout}
        text={t('Logout')}
        icon={<LogoutIcon />}
      />
    </Menu>
  );
};

export default ProfileMenu;
