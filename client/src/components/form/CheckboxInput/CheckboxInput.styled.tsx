import FormControl from '../FormControl';
import { Checkbox, FormControlLabel } from '@mui/material';
import { styled } from 'theme/utils';

export const FormWrapper = styled(FormControl)`
`;

export const FormLable = styled(FormControlLabel)`
  align-items: flex-start !important;

  .MuiCheckbox-root {
    padding-top: 0;
  }

  .MuiFormControlLabel-label {
    font-size: 1rem !important;
  }

`;