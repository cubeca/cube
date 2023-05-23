import { Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { removeAuthToken } from '../../../../../utils/auth';

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
    <Stack component="nav" direction="row" spacing={2}>
      <s.AuxButton variant="outlined" onClick={handleLogin}>
        {t('Login')}
      </s.AuxButton>
      {isLoggedIn && (
        <s.AuxButton variant="outlined" onClick={handleLogout}>
          {t('Logout')}
        </s.AuxButton>
      )}
    </Stack>
  );
};

export default AuxiliaryNav;
