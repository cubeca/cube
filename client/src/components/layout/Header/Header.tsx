import PrimaryNav from './components/PrimaryNav';
import AuxiliaryNav from './components/AuxiliaryNav';
import { useLocation } from 'react-router-dom';
import * as s from './Header.styled';

const Header = () => {
  const location = useLocation();
  const excludeHeaderOn = '/embed';
  const storedProfile = JSON.parse(localStorage.getItem('PROFILE') || '{}');

  return !location.pathname.startsWith(excludeHeaderOn) ? (
    <s.Header
      component="header"
      direction="row"
      sx={{
        pointerEvents: storedProfile.status === 'inactive' ? 'none' : 'auto'
      }}
    >
      <s.HomeLink to="/" />
      <AuxiliaryNav />
    </s.Header>
  ) : null;
};

export default Header;
