import { Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { removeAuthToken } from '../../../../../utils/auth';
import HamburgerMenu from '../HamburgerMenu';
import * as s from './AuxiliaryNav.styled';
import useAuth from 'hooks/useAuth';

const AuxiliaryNav = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const handleLogout = () => {
    removeAuthToken();
    navigate('/');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <Stack component="nav" direction="row" alignItems="center" spacing={2}>
      <s.AuxButton variant="outlined" onClick={handleLogin}>
        {t('Login')}
      </s.AuxButton>
      {isLoggedIn && (
        <s.AuxButton variant="outlined" onClick={handleLogout}>
          {t('Logout')}
        </s.AuxButton>
      )}
      <HamburgerMenu />
    </Stack>
  );
};

export default AuxiliaryNav;
