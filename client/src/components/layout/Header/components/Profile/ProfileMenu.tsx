import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ProfileMenuItem from './ProfileMenuItem';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { PlaylistAdd } from '@mui/icons-material/';
import NotInterestedIcon from '@mui/icons-material/NotInterested';
import UpdateEmailDialog from './UpdateEmailDialog';
import DeactivateProfileDialog from './DeactivateProfileDialog';
import { useContext, useState } from 'react';
import gov4git from '../../../../../assets/icons/gov4git.svg';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PasswordIcon from '@mui/icons-material/Password';
import ChangePasswordDialog from './ChangePasswordDialog';
import useAuth from 'hooks/useAuth';
import * as s from './Profile.styled';
import { GetProfileByTagData } from '@cubeca/cube-svc-client-oas-axios';
import { getUser } from 'utils/auth';

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
  const [isDeactivateProfileDialogOpen, setIsDeactivateProfileDialogOpen] =
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

  const handleGov4Cube = () => {
    window.location.href = 'https://gov4cube.com';
  };

  const handleDeactivateProfile = () => {
    setIsDeactivateProfileDialogOpen(true);
    onClose();
  };

  const handleChangePasswordDialogClose = () => {
    setIsChangePasswordDialogOpen(false);
  };

  const handleEmailUpdateDialogClose = () => {
    setIsUpdateEmailDialogOpen(false);
  };

  const handleDeactivateProfileDialogClose = () => {
    setIsDeactivateProfileDialogOpen(false);
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
            clipIcon={2}
          />
        )}
        {!profileId && (
          <ProfileMenuItem
            onClick={() => handleProfile(`/user/${getUser().uuid}`)}
            text={t('My Playlists')}
            icon={<PlaylistAdd />}
          />
        )}

        <ProfileMenuItem
          onClick={handleGov4Cube}
          text={t('Gov4Cube')}
          icon={<img src={gov4git} alt="Gov4Cube Icon" />}
        />
        <ProfileMenuItem
          onClick={handleEmailUpdate}
          text={t('Update Email')}
          icon={<MailOutlineIcon />}
          clipIcon={2}
        />
        <ProfileMenuItem
          onClick={handleChangePassword}
          text={t('Change Password')}
          icon={<PasswordIcon />}
        />
        {profileId && profile && (
          <ProfileMenuItem
            onClick={handleDeactivateProfile}
            text={t('Deactivate Profile')}
            icon={<NotInterestedIcon />}
            clipIcon={1.5}
          />
        )}
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
      <DeactivateProfileDialog
        isOpen={isDeactivateProfileDialogOpen}
        onClose={handleDeactivateProfileDialogClose}
      />
    </>
  );
};

export default ProfileMenu;
