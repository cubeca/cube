import { Menu } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ProfileMenuItem from './ProfileMenuItem';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import useProfile from 'hooks/useProfile';
import UpdateEmailDialog from './UpdateEmailDialog';
import { useContext, useState } from 'react';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PasswordIcon from '@mui/icons-material/Password';
import ChangePasswordDialog from './ChangePasswordDialog';
import useAuth from 'hooks/useAuth';
import { UserContext } from 'providers/UserProvider';
import * as s from './Profile.styled';

interface ProfileMenuProps {
  open: boolean;
  anchorEl: null | HTMLElement;
  onClose: () => void;
  id: string;
}

const ProfileMenu = ({ open, anchorEl, onClose, id }: ProfileMenuProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: profile } = useProfile();
  const [isUpdateEmailDialogOpen, setIsUpdateEmailDialogOpen] = useState(false);
  const [isChangePasswordDialogOpen, setIsChangePasswordDialogOpen] =
    useState(false);
  const { logout } = useAuth();
  const { user } = useContext(UserContext);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleProfile = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleEmailUpdate = () => {
    setIsUpdateEmailDialogOpen(true);
    onClose();
  };

  const handleChangePassword = () => {
    setIsChangePasswordDialogOpen(true);
    onClose();
  };

  const handleChangePasswordDialogClose = () => {
    setIsChangePasswordDialogOpen(false);
  };

  const handleEmailUpdateDialogClose = () => {
    setIsUpdateEmailDialogOpen(false);
  };

  return (
    <>
      <s.ProfileMenu
        open={open}
        anchorEl={anchorEl}
        onClose={onClose}
        id={id}
        MenuListProps={{
          'aria-labelledby': id
        }}
      >
        {profile.profileId && (
          <ProfileMenuItem
            onClick={() => handleProfile(`/profile/${profile.profileId}`)}
            text={t('My Profile')}
            icon={<AccountBoxIcon />}
          />
        )}
        <ProfileMenuItem
          onClick={handleEmailUpdate}
          text={t('Update Email')}
          icon={<MailOutlineIcon />}
        />
        <ProfileMenuItem
          onClick={handleChangePassword}
          text={t('Change Password')}
          icon={<PasswordIcon />}
        />
        <ProfileMenuItem
          onClick={handleLogout}
          text={t('Logout')}
          icon={<LogoutIcon />}
        />
      </s.ProfileMenu>
      <UpdateEmailDialog
        isOpen={isUpdateEmailDialogOpen}
        onClose={handleEmailUpdateDialogClose}
        userId={user?.uuid || ''}
      />
      <ChangePasswordDialog
        isOpen={isChangePasswordDialogOpen}
        onClose={handleChangePasswordDialogClose}
        email={user?.email || ''}
      />
    </>
  );
};

export default ProfileMenu;
