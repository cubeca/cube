import FormControl from '../FormControl';
import { FormControlLabel } from '@mui/material';
import { styled } from 'theme/utils';
import Switch from '@mui/material/Switch';

export const FormWrapper = styled(FormControl)``;

export const FormLabel = styled(FormControlLabel)`
  align-items: flex-start !important;

  .MuiFormControlLabel-label {
    font-size: 1rem !important;
  }
`;

export const EmbedToggleSwitch = styled(Switch)`
  & .MuiSwitch-switchBase.Mui-checked {
    color: ${({ theme, colormode }) =>
      colormode === 'dark'
        ? `${theme.palette.background.default} !important`
        : theme.palette.primary.light};
  }
  & .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track {
    background-color: ${({ theme, colormode }) =>
      colormode === 'dark'
        ? `${theme.palette.background.default} !important`
        : theme.palette.primary.light};
  }
`;
