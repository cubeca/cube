import { ReactComponent as CubeLogo } from 'assets/icons/cube.svg';
import NavPanel from './components/NavPanel';

import * as s from './Header.styled';

const Header = () => (
  
  <s.Header
    component="header"
    direction="row"
    justifyContent="space-between"
    alignItems="center"
    position="relative"
width="100%"
    paddingLeft="50px"
  >
 
    <CubeLogo />
    <NavPanel />
  </s.Header>

);

export default Header;
