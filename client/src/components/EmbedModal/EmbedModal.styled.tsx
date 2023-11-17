import { styled } from 'theme/utils';
import Button from 'components/Button';
import {
  Box,
  Dialog as MuiDialog,
  DialogTitle,
  IconButton,
  Typography
} from '@mui/material';

export const ModalButton = styled(Button)`
  margin: 20px;
`;

export const Close = styled(IconButton)`
  position: absolute;
  right: 8px;
  top: 8px;
  color: ${(props) => props.theme.palette.background.default};
`;

export const Title = styled(DialogTitle)`
  width: 600px;
  max-width: 100%;
  background-color: ${(props) => props.theme.palette.primary.main};

  ${(props) => props.theme.breakpoints.up('sm')} {
  }

  * {
    color: ${(props) => props.theme.palette.background.default};
  }
`;
