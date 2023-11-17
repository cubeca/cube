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

  .MuiInputBase-root {
    margin-bottom: 10px;
  }

  & label {
    display: block;
    font-size: 1rem;
    font-weight: 500;
    margin-bottom: 0;
    font-weight: 600;
  }

  &.dark {
    & input,
    & fieldset,
    & input:focus + fieldset,
    & input:active + fieldset,
    & input:hover + fieldset {
      border-color: ${(props) =>
        props.theme.palette.background.default} !important;
    }

    & input,
    & textarea {
      color: ${(props) => props.theme.palette.background.default};
    }

    & label {
      color: ${(props) => props.theme.palette.background.default};
    }

  }
`;
