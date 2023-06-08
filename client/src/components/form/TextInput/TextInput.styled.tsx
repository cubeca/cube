import { styled } from 'theme/utils';
import TextInput from 'components/form/TextInput';

export const DarkTextInput = styled(TextInput)`

  & label {
    color: ${(props) => props.theme.palette.background.default};
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
`;