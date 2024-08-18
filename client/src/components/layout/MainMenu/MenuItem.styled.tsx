import {
  ListItemIcon,
  ListItemText,
  MenuItem as MuiMenuItem,
  Typography,
  Box
} from '@mui/material';

import { styled } from 'theme/utils';

export const Item = styled(MuiMenuItem)`
  margin-bottom: 1px;
  padding-left: 20px;
  padding-right: 20px;

  cursor: ${(props) => (props.active ? 'pointer' : 'default')};

  pointer-events: ${(props) => (props.active ? 'auto' : 'none')};

  .MuiTypography-root {
    font-size: ${(props) =>
      props.active ? props.theme.typography.body1.fontSize : '15px'} !important;

    font-weight: ${(props) => (props.active ? '500' : '400')} !important;
  }

  &:hover {
    background-color: ${(props) =>
      props.active
        ? 'rgba(255, 255, 255, 0.3)'
        : props.theme.palette.primary.main};
  }
`;
