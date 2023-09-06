import { Box, List, MenuItem } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { styled } from 'theme/utils';

export const PrimaryNav = styled(Box)`
  display: none;

  ${(props) => props.theme.breakpoints.up('md')} {
    display: block;
  }
`;

export const NavList = styled(List)`
  margin-top: 10px;
`;

export const NavItem = styled(MenuItem)`
  margin: 0;
  display: inline-block;

  &:hover {
    background: transparent;
  }

  a {
    color: inherit;
    text-decoration: none;
    font-size: inherit;
    font-weight: 500;
    line-height: inherit;
  }
`;

export const LinkButton = styled(RouterLink)`
  font-size: inherit;
  font-weight: 500;
  color: inherit;
  text-decoration: inherit;
  line-height: inherit;
`;
