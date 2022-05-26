import { ReactComponent as CubeLogo } from 'assets/icons/cube.svg';
import NavPanel from '../NavPanel';

import * as s from './Header.styled';

const Header = () => (
  <s.Header
    component="header"
    direction="row"
    justifyContent="space-between"
    alignItems="center"
    padding={2}
  >
    <CubeLogo />
    <NavPanel />
  </s.Header>
);

export default Header;
