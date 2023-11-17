import { styled } from 'theme/utils';
import Button from 'components/Button';
import {
  Box,
  Dialog as MuiDialog,
  DialogTitle,
  IconButton,
  TextField,
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

export const EmbedTextField = styled(TextField)`
  & label {
    color: ${(props) => props.theme.palette.background.default};
    display: block;
    font-size: 1rem;
    font-weight: 500;
    margin-bottom: 0;
    font-weight: 600;
  }
`;
