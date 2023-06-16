import { styled } from 'theme/utils';
import FormControl from '../FormControl';
import TextInput from 'components/form/TextInput';

export const DarkTextInput = styled(TextInput)`

  & label {
    color: ${(props) => props.theme.palette.background.default};
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
    border-color: ${(props) => props.theme.palette.background.default} !important;
  }

  & input {
    color: ${(props) => props.theme.palette.background.default};
  }

  & .MuiInputBase-formControl {
    margin-bottom: 24px;
  }
`;