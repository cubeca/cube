import { Translate } from '@mui/icons-material';
import { Box, Stack } from '@mui/material';
import { styled } from 'theme/utils';

export const Hamburger = styled(Box)`
  width: 30px;
  height: 30px;
`;

export const Menu = styled(Stack)`
  position: absolute;
  top: 0;
  right: 0;
  width: 300px;
  height: 100vh;
  background-color: ${(props) => props.theme.palette.primary.main};
  transition: transform 0.4s ease-in-out;
  transform: translateX(300px);
  
  ${(props) => props.active && `
    transform: translateX(0);
    `}
`;

export const MenuInner = styled(Box)`
  overflow-y: auto;
`;

export const Kebab = styled(Box)`
  cursor: pointer;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.1);
  }
`;

export const Close = styled(Box)`
  position: fixed;
  top: 24px;
  right: 32px;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.1);
  }
`;

export const MenuHeader = styled(Box)`
  padding: 32px 32px 0;
  
  * {
    color: ${(props) => props.theme.palette.background.paper};
  }

`;

export const MenuSection = styled(Box)`
  padding: 32px 32px 0;

  * {
    color: ${(props) => props.theme.palette.background.paper};
  }

  ul {
    list-style: none;
  }
`;