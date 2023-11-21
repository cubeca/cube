import { TextField as MuiTextField, alpha } from '@mui/material';
import { styled } from 'theme/utils';

export const TextInput = styled(MuiTextField)`
  & input,
  & fieldset,
  & input:focus + fieldset,
  & input:active + fieldset,
  & input:hover + fieldset {
    border-color: ${({ theme, colorMode }) =>
      colorMode === 'dark'
        ? theme.palette.background.default
        : theme.palette.primary.main} !important;
  }

  & input,
  & textarea {
    color: ${({ theme, colorMode }) =>
      colorMode === 'dark'
        ? theme.palette.background.default
        : theme.palette.primary.light};
  }

  & .MuiInputBase-input {
    padding: 16.5px 16px;
  }

  & .MuiInputBase-formControl {
    margin-bottom: 24px;
  }

  & label {
    color: ${({ theme, colorMode }) =>
      colorMode === 'dark'
        ? `${theme.palette.background.default} !important`
        : `${theme.palette.primary.light} !important`};
    display: block;
    font-size: 1rem;
    font-weight: 500;
    margin-bottom: 0;
    font-weight: 600;
  }
`;
