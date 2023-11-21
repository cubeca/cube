import { styled } from 'theme/utils';
import PasswordInput from './PasswordInput';
import { alpha } from '@mui/material/styles';
interface AdornmentProps {
  colorMode?: 'light' | 'dark';
}
export const StyledPasswordInput = styled(PasswordInput)`
  && label {
    color: ${({ theme, colorMode }) =>
      colorMode === 'dark'
        ? `${theme.palette.background.default} !important`
        : theme.palette.primary.light}
    display: block;
    font-size: 1rem;
    font-weight: 500;
    margin-bottom: 0;
    font-weight: 600;
  }

  & input,
  & fieldset,
  & input:focus + fieldset,
  & input:active + fieldset,
  & input:hover + fieldset {
    border-color: ${({ theme, colorMode }) =>
      colorMode === 'dark'
        ? theme.palette.background.default
        : theme.palette.primary.light} !important;
  }

  & input,
  & textarea {
    color: ${({ theme, colorMode }) =>
      colorMode === 'dark'
        ? theme.palette.background.default
        : theme.palette.primary.light};
  }

  & .MuiInputBase-formControl {
    margin-bottom: 24px;
  }

  & .MuiInputLabel-root {
    color: ${({ theme, colorMode }) =>
      colorMode === 'dark'
        ? theme.palette.primary.light
        : theme.palette.background.default};
  }
`;
