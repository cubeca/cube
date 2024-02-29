import FormControl from '../FormControl';
import { FormControlLabel } from '@mui/material';
import { styled } from 'theme/utils';

export const FormWrapper = styled(FormControl)``;

export const FormLabel = styled(FormControlLabel)`
  align-items: flex-start !important;

  .MuiFormControlLabel-label {
    font-size: 1rem !important;
  }
`;
