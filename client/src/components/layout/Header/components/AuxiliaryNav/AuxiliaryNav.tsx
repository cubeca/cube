import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { removeAuthToken } from '../../../../../utils/auth';
import HamburgerMenu from '../HamburgerMenu';
import * as s from './AuxiliaryNav.styled';
import useAuth from 'hooks/useAuth';
import { useState } from 'react';
import { MainMenu } from 'components/layout/MainMenu';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Profile } from '../Profile';

const AuxiliaryNav = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

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
    <s.Aux component="nav" direction="row" alignItems="center" spacing={2}>
      {isLoggedIn ? (
        <Profile />
      ) : (
        <s.AuxButton variant="outlined" onClick={handleLogin}>
          {t('Login')}
        </s.AuxButton>
      )}
      
      <s.AuxMenuTrigger
        onClick={handleMenuOpen}
        aria-controls={open ? menuId : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        <MoreVertIcon />
      </s.AuxMenuTrigger>
      <MainMenu
        open={open}
        anchorEl={anchorEl}
        onClose={handleMenuClose}
        id={menuId}
        isLoggedIn={isLoggedIn}
      />
    </s.Aux>
  );
};

export default AuxiliaryNav;
