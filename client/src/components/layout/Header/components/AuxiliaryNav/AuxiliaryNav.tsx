import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import * as s from './AuxiliaryNav.styled';
import useAuth from 'hooks/useAuth';
import { useMediaQuery } from '@mui/material';
import { useEffect, useState } from 'react';
import { MainMenu } from 'components/layout/MainMenu';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Profile } from '../Profile';

const AuxiliaryNav = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const open = Boolean(anchorEl);
  const isSmallScreen = useMediaQuery('(max-width: 390px)');

  const handleLogin = () => {
    if (location.pathname.includes('/login')) {
      // If on login page, force refresh to reset state
      navigate(0);
    } else {
      navigate('/login');
    }
  };

  useEffect(() => {
    if (isLoggedIn !== undefined) {
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
  }, [isLoggedIn]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const menuId = 'main-menu';

  return (
    <s.Aux component="nav" direction="row" alignItems="center" spacing={2}>
      {!isSmallScreen && (
        <s.StyledLink to="/search">
          <s.StyledHomeIcon isLoggedIn={isLoggedIn} />
        </s.StyledLink>
      )}

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          {isLoggedIn ? (
            <Profile />
          ) : (
            <s.AuxButton variant="outlined" onClick={handleLogin}>
              {t('Login')}
            </s.AuxButton>
          )}
        </>
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
