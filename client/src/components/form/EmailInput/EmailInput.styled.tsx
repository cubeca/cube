import { styled } from 'theme/utils';
import EmailInput from './EmailInput';

export const StyledEmailInput = styled(EmailInput)`
  & label {
    color: ${({ theme, colormode }) =>
      colormode === 'dark'
        ? `${theme.palette.background.default} !important`
        : theme.palette.primary.light};
    display: block;
    font-size: 1rem;
    font-weight: 500;
    margin-bottom: 0;
  }

  & input,
  & fieldset,
  & input:focus + fieldset,
  & input:active + fieldset,
  & input:hover + fieldset {
    border-color: ${({ theme, colormode }) =>
      colormode === 'dark'
        ? `${theme.palette.background.default} !important`
        : theme.palette.primary.light};
  }

  & input,
  & textarea {
    color: ${({ theme, colormode }) =>
      colormode === 'dark'
        ? `${theme.palette.background.default} !important`
        : theme.palette.primary.light};
  }

  & .MuiInputBase-formControl {
    margin-bottom: 24px;
  }
`;
