import {
  InputAdornment,
  TextField as MuiTextField,
  alpha
} from '@mui/material';
import { styled } from 'theme/utils';

export const TextInput = styled(MuiTextField)`
  & input,
  & fieldset,
  & input:focus + fieldset,
  & input:active + fieldset,
  & input:hover + fieldset {
    border-color: ${(props) =>
      props.colorMode === 'dark'
        ? props.theme.palette.background.default
        : props.theme.palette.primary.main} !important;
  }

  & input,
  & textarea {
    color: ${(props) =>
      props.colorMode === 'dark'
        ? props.theme.palette.background.default
        : props.theme.palette.primary.light};
  }

  & .MuiInputBase-input {
    padding: 16.5px 16px;
  }

  & .MuiInputBase-formControl {
    margin-bottom: 24px;
  }

  && .MuiFormLabel-root.MuiFormLabel-colorPrimary {
    color: ${(props) =>
      props.colorMode === 'dark'
        ? `${props.theme.palette.background.default} !important`
        : `${alpha('#D9FFEE', 0.5)} !important`};
    display: block;
    font-size: 1rem;
    font-weight: 500;
    margin-bottom: 0;
    font-weight: 600;
  }
`;
