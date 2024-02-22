import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ProfileMenuItem from './ProfileMenuItem';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { PlaylistAdd } from '@mui/icons-material/';
import UpdateEmailDialog from './UpdateEmailDialog';
import { useContext, useState } from 'react';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PasswordIcon from '@mui/icons-material/Password';
import ChangePasswordDialog from './ChangePasswordDialog';
import useAuth from 'hooks/useAuth';
import * as s from './Profile.styled';
import { GetProfileByTagData } from '@cubeca/cube-svc-client-oas-axios';

interface ProfileMenuProps {
  open: boolean;
  anchorEl: null | HTMLElement;
  onClose: () => void;
  id: string;
  profile?: GetProfileByTagData;
  profileId?: string;
}

const ProfileMenu = ({
  open,
  anchorEl,
  onClose,
  id,
  profile,
  profileId
}: ProfileMenuProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isUpdateEmailDialogOpen, setIsUpdateEmailDialogOpen] = useState(false);
  const [isChangePasswordDialogOpen, setIsChangePasswordDialogOpen] =
    useState(false);
  const { logout } = useAuth();

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
        {profileId && profile && (
          <ProfileMenuItem
            onClick={() => handleProfile(`/profile/${profile.tag}`)}
            text={t('My Profile')}
            icon={<AccountBoxIcon />}
          />
        )}
        {!profileId && (
          <ProfileMenuItem
            onClick={() => handleProfile(`/user/${user?.uuid}`)}
            text={t('My Playlists')}
            icon={<PlaylistAdd />}
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
      />
      <ChangePasswordDialog
        isOpen={isChangePasswordDialogOpen}
        onClose={handleChangePasswordDialogClose}
      />
    </>
  );
};

export default ProfileMenu;
