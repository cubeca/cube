import PrimaryNav from './components/PrimaryNav';
import AuxiliaryNav from './components/AuxiliaryNav';
import { useLocation } from 'react-router-dom';
import * as s from './Header.styled';

const Header = () => {
  const location = useLocation();
  const excludeHeaderOn = '/embed';

  return !location.pathname.startsWith(excludeHeaderOn) ? (
    <s.Header component="header" direction="row">
      <s.HomeLink to="/" />
      {/* leaving this here in case changes go in another direction */}
      {/* <PrimaryNav /> */}
      <AuxiliaryNav />
    </s.Header>
  ) : null;
};

export default Header;
