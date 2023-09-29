import { Link } from 'react-router-dom';
import { styled } from 'theme/utils';
import { Typography } from '@mui/material';

export const NavLink = styled(Link)`
  text-decoration: none;
  color: ${(props) => props.theme.palette.primary.light};
`;

export const Text = styled(Typography)`
  cursor: pointer;
  color: ${(props) => props.theme.palette.primary.light};
`;
