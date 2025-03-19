import { styled } from 'theme/utils';
import { Stack } from '@mui/material';
import Button from 'components/Button';
import { Link } from 'react-router-dom';
import { Search } from '@mui/icons-material';

export const StyledLink = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none !important;
`;

export const StyledSearchIcon = styled(Search)`
  height: 30px;
  width: 30px;
  color: ${(props) => props.theme.palette.primary.main};
 
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
  transition: color 0.2s ease;

  &:hover {
    color: ${(props) => props.theme.palette.primary.light};
  }

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

export const AuxContent = styled('text')`
  font-weight: 500;
  color: ${(props) => props.theme.palette.primary.light};
  margin-right: ${(props) => (props.isLoggedIn ? '16px' : '32px')};
  padding: 8px 10px;
`;

export const CloseButton = styled('button')`
  position: absolute;
  top: 16px;
  right: 16px;
  background: transparent;
  border: none;
  padding: 8px;
  margin: 0;
  cursor: pointer;
  color: ${(props) => props.theme.palette.background.default};
  transition: opacity 0.2s ease;
  z-index: 2000;

  &:hover {
    opacity: 0.8;
  }

  svg {
    width: 24px;
    height: 24px;
  }
`;
