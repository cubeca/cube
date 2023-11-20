import { styled } from 'theme/utils';
import PasswordInput from './PasswordInput';
import { alpha } from '@mui/material/styles';
interface AdornmentProps {
  colorMode?: 'light' | 'dark';
}
export const StyledPasswordInput = styled(PasswordInput)`
  & label {
    color: ${(props) =>
      props.colorMode === 'dark'
        ? props.theme.palette.background.default
        : alpha('#D9FFEE', 0.5)};
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
    border-color: ${(props) =>
      props.colorMode === 'dark'
        ? props.theme.palette.background.default
        : 'inherit'} !important;
  }

  & input,
  & textarea {
    color: ${(props) =>
      props.colorMode === 'dark'
        ? props.theme.palette.background.default
        : 'inherit'};
  }

  & .MuiInputBase-formControl {
    margin-bottom: 24px;
  }

  & .MuiInputLabel-root {
    color: ${(props) =>
      props.colorMode === 'dark'
        ? alpha('#D9FFEE', 0.5)
        : props.theme.palette.background.default};
  }
`;
