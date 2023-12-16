import { Box, TextField as MuiTextField } from '@mui/material';
import { styled } from 'theme/utils';

export const TextInput = styled(MuiTextField)`
  & input,
  & fieldset,
  & input:focus + fieldset,
  & input:active + fieldset,
  & input:hover + fieldset {
    border-color: ${({ theme, colormode }) =>
      colormode === 'dark'
        ? theme.palette.background.default
        : theme.palette.primary.main};
  }

  & input,
  & textarea {
    color: ${({ theme, colormode }) =>
      colormode === 'dark'
        ? theme.palette.background.default
        : theme.palette.primary.light};
  }

  & .MuiInputBase-input {
    padding: 16.5px 16px;
  }

  & .MuiInputBase-formControl {
    margin-bottom: 24px;
  }
`;

export const FieldWrapper = styled(Box)`
  & label {
    color: ${({ theme, colormode }) =>
      colormode === 'dark'
        ? `${theme.palette.background.default}`
        : theme.palette.primary.light};
    display: block;
    font-size: 1rem;
    font-weight: 500;
    margin-bottom: 0;
    font-weight: 600;
  }
`;
