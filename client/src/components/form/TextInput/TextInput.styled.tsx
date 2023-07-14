import { TextField as MuiTextField } from '@mui/material';
import { styled } from 'theme/utils';

export const TextInput = styled(MuiTextField)`

& label {
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
      props.theme.palette.primary.main} !important;
  }

  & input,
  & textarea {
    color: ${(props) => props.theme.palette.primary.light};
  }

  & .MuiInputBase-input {
    padding: 16.5px 16px;
  }

  & .MuiInputBase-formControl {
    margin-bottom: 24px;
  }

  &.dark {

    & label {
      color: ${(props) => props.theme.palette.background.default};
    }

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

  }
`;
