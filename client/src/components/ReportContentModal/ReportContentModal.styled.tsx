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

export const EditWrapper = styled(Box)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  label {
    display: block;
    position: absolute;
    top: 4px;
    left: 4px;
    width: calc(100% - 8px);
    height: calc(100% - 8px);
    padding: 0;
    border: 0;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.5);

    p {
      position: absolute;
      top: 50%;
      left: 0;
      width: 100%;
      margin: 8px auto 0;
      text-align: center;
      color: ${(props) => props.theme.palette.primary.light};
      font-size: 0.75rem;
      font-weight: 500;
    }

    svg {
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: -14px;
      margin-top: -21px;

      circle,
      path {
        fill: ${(props) => props.theme.palette.primary.light};
      }
    }
  }
`;

export const EditFieldsWrapper = styled(Box)`
  label {
    color: ${(props) => props.theme.palette.background.default};
  }
`;

export const ModalButton = styled(Button)`
  margin: 20px;
`;

export const Close = styled(IconButton)`
  position: absolute;
  right: 8px;
  top: 8px;
  color: ${(props) => props.theme.palette.background.default};
`;

export const ReportContentTextField = styled(TextField)`
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
