import { Box, List, ListItem } from '@mui/material';
import { Link } from 'react-router-dom';
import { styled } from 'theme/utils';

export const NavList = styled(List)`
  columns: 1;
  padding: 0;
  margin: 20px 0;
  font-size: 1rem;

  ${(props) => props.theme.breakpoints.up('md')} {
    margin: 0;
  }
`;

export const NavItem = styled(ListItem)`
  padding: 8px 0;

  a {
    color: inherit;
    text-decoration: none;
    font-size: inherit;
    font-weight: 500;
    line-height: inherit;
  }
`;

export const NavLink = styled(Link)`
  text-decoration: none;
  color: ${(props) => props.theme.palette.primary.light};
`;