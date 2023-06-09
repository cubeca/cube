import { Button, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { removeAuthToken } from '../../../../../utils/auth';

import * as s from './AuxiliaryNav.styled';
import useAuth from 'hooks/useAuth';
import { useState } from 'react';
import { MainMenu } from 'components/layout/MainMenu';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const AuxiliaryNav = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleLogout = () => {
    removeAuthToken();
    navigate('/');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const menuId = 'main-menu';

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
      <Button
        onClick={handleMenuOpen}
        aria-controls={open ? menuId : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        <MoreVertIcon />
      </Button>
      <MainMenu
        open={open}
        anchorEl={anchorEl}
        onClose={handleMenuClose}
        id={menuId}
        isLoggedIn={isLoggedIn}
      />
    </Stack>
  );
};

export default AuxiliaryNav;
