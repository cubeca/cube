import {
  ListItemIcon,
  ListItemText,
  MenuItem as MuiMenuItem,
  Typography,
  Box
} from '@mui/material';

import { styled } from 'theme/utils';

interface ItemProps {
  active: boolean;
}

export const Item = styled(MuiMenuItem)<ItemProps>`
  margin-bottom: 1px;
  padding: 6px 20px;
  transition: background-color 0.2s ease;

  cursor: ${(props) => (props.active ? 'pointer' : 'default')};
  pointer-events: ${(props) => (props.active ? 'auto' : 'none')};
  color: ${(props) => props.theme.palette.background.default} !important;

  .MuiTypography-root {
    font-size: ${(props) =>
      props.active ? props.theme.typography.body1.fontSize : '15px'} !important;
    font-weight: ${(props) => (props.active ? '500' : '400')} !important;
    color: inherit;
  }

  &:hover {
    background-color: ${(props) =>
      props.active ? 'rgba(255, 255, 255, 0.3)' : 'transparent'} !important;
  }

  &:focus-visible {
    background-color: rgba(255, 255, 255, 0.1);
    outline: 2px solid ${(props) => props.theme.palette.background.default};
    outline-offset: -2px;
  }

  .MuiListItemIcon-root {
    color: inherit;
    min-width: auto;
  }
`;
