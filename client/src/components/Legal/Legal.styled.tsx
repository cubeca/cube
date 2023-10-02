import { Link } from 'react-router-dom';
import { styled } from 'theme/utils';

export const NavLink = styled(Link)`
  text-decoration: none;
  color: ${(props) => props.theme.palette.primary.light};
`;