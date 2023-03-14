import PrimaryNav from './components/PrimaryNav';
import AuxiliaryNav from './components/AuxiliaryNav';
import * as s from './Header.styled';

const Header = () => (
  <s.Header component="header" direction="row">
    <s.HomeLink to="/about" />
    <PrimaryNav />
    <AuxiliaryNav />
  </s.Header>
);

export default Header;
