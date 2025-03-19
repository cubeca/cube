import {
  Box,
  FormControl as MuiFormControl,
  FormHelperText,
  InputProps,
  FormLabel
} from '@mui/material';
import { FC, ReactNode } from 'react';

interface FormControlInputProps extends InputProps {
  label?: string;
  name: string;
  id?: string;
  endIcon?: ReactNode;
  error?: boolean;
  helperText?: string;
  helperTextId?: string;
  children: ReactNode;
}

const FormControl: FC<FormControlInputProps> = ({
  className = '',
  id,
  name,
  error,
  label,
  helperText,
  helperTextId,
  children,
  fullWidth
}) => (
  <MuiFormControl
    className={className}
    sx={{ flexDirection: 'row', alignItems: 'center' }}
    error={!!error}
    fullWidth={fullWidth}
    aria-labelledby={`${name}-label`}
  >
    <Box width="100%">
      <Box mb="0.85rem">
        <FormLabel htmlFor={name} id={`${name}-label`}>{label}</FormLabel>
      </Box>
      {children}
      <FormHelperText id={`${name}-helper-text`} sx={{ margin: '0 0 0', fontSize: 18 }}>
        {!!error && helperText}
      </FormHelperText>
    </Box>
  </MuiFormControl>
);

export default FormControl;
