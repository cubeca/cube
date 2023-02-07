import { TextField as MuiTextField } from '@mui/material';
import { FC, HTMLInputTypeAttribute } from 'react';
import { Controller } from 'react-hook-form';

import FormControl from '../FormControl';
import { InputProps } from '../types';

interface TextInputProps extends InputProps {
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  variant?: 'standard' | 'outlined';
  rows?: string | number;
  multiline?: boolean;
}

const defaultRules = {
  required: true
};

const TextInput: FC<TextInputProps> = ({
  label,
  name,
  control,
  defaultValue = '',
  rules = {},
  type = 'text',
  className = '',
  id = 'text-input',
  helperText = ' ',
  helperTextId,
  placeholder,
  fullWidth,
  sx,
  variant = 'standard',
  rows,
  multiline,
  errorMessage
}) => (
  <Controller
    name={name}
    control={control}
    rules={{
      ...defaultRules,
      ...rules
    }}
    defaultValue={defaultValue}
    render={({ field, fieldState: { error } }) => (
      <FormControl
        className={className}
        id={id}
        label={label}
        error={!!error}
        helperText={error ? error.message : helperText}
        helperTextId={helperTextId}
        fullWidth={fullWidth}
      >
        <MuiTextField
          sx={sx}
          placeholder={placeholder}
          variant={variant}
          size="medium"
          type={type}
          error={!!error}
          fullWidth={fullWidth}
          multiline={multiline}
          rows={rows}
          {...field}
        />
      </FormControl>
    )}
  />
);

export default TextInput;
