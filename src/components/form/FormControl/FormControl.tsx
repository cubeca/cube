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
  error,
  label,
  helperText,
  helperTextId,
  children,
  fullWidth
}) => {
  return (
    <MuiFormControl
      className={className}
      sx={{ flexDirection: 'row', alignItems: 'center' }}
      id={id}
      error={!!error}
      fullWidth={fullWidth}
    >
      <Box width="100%">
        <Box mb="0.85rem">
          <FormLabel htmlFor={id}>{label}</FormLabel>
        </Box>
        {children}
        <FormHelperText id={helperTextId}>
          {!!error && helperText}
        </FormHelperText>
      </Box>
    </MuiFormControl>
  );
};

export default FormControl;
