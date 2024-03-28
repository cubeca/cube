import { styled } from 'theme/utils';
import { Stack } from '@mui/material';
import Button from 'components/Button';
import { Link } from 'react-router-dom';
import { ReactComponent as HomeIcon } from '../../../../../assets/icons/home.svg';

export const StyledLink = styled(Link)`
  display: flex;
  align-items: center;
`;

export const StyledHomeIcon = styled(HomeIcon)`
  height: 30px;
  width: 30px;
  color: ${(props) => props.theme.palette.primary.main};
  margin-right: ${(props) => (props.isLoggedIn ? '16px' : '32px')};
`;

export const Aux = styled(Stack)`
  position: relative;

  ${(props) => props.theme.breakpoints.up('md')} {
    top: 4px;
  }
`;

export const AuxMenuTrigger = styled('button')`
  background: transparent;
  border: none;
  padding: 0;
  margin: 0 !important;
  cursor: pointer;
  color: ${(props) => props.theme.palette.primary.main};
  width: 40px;
  height: 40px;
  position: relative;

  svg {
    position: absolute;
    top: 0;
    right: -16px;
    width: 100%;
    height: 100%;
  }
`;

export const AuxButton = styled(Button)`
  margin: 0 !important;
  font-weight: 500;
  color: ${(props) => props.theme.palette.primary.light};
  border-color: ${(props) => props.theme.palette.primary.dark};
  padding: 8px 24px;
`;
