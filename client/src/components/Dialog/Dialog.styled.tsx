import { styled } from 'theme/utils';
import {
  Box,
  Dialog as MuiDialog,
  DialogTitle,
  IconButton
} from '@mui/material';

export const Wrapper = styled(MuiDialog)`
`;

export const Title = styled(DialogTitle)`
  background-color: ${(props) => props.theme.palette.primary.main};

  * {
    color: ${(props) => props.theme.palette.background.default};
  }
`;

export const Close = styled(IconButton)`
  position: absolute;
  right: 8px;
  top: 8px;
  color: ${(props) => props.theme.palette.background.default};
`;

export const Body = styled(Box)`
  padding: 24px;
  color: ${(props) => props.theme.palette.background.default};
  background-color: ${(props) => props.theme.palette.primary.main};
`;

