import { Box, List, ListItem } from '@mui/material';
import { Link } from 'react-router-dom';
import { styled } from 'theme/utils';

export const NavList = styled(List)`
  columns: 2;
  padding: 0;
`;

export const NavItem = styled(ListItem)`
  padding: 0;
`;

export const NavLink = styled(Link)`
  text-decoration: none;
  color: ${(props) => props.theme.palette.primary.light};
`;
