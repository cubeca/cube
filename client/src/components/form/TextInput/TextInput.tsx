import { FC, HTMLInputTypeAttribute } from 'react';
import FormControl from '../FormControl';
import { InputProps as MuiInputProps } from '../types';
import { Controller } from 'react-hook-form';
import * as s from './TextInput.styled';
import { Box } from '@mui/material';

interface TextInputProps extends MuiInputProps {
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  variant?: 'standard' | 'outlined';
  rows?: string | number;
  InputProps?: any;
  multiline?: boolean;
  colormode?: 'light' | 'dark';
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
  helperText = ' ',
  placeholder,
  fullWidth,
  sx,
  variant = 'outlined',
  rows,
  InputProps,
  multiline,
  colormode = 'light'
}) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={{
        ...defaultRules,
        ...rules
      }}
      defaultValue={defaultValue}
      render={({ field, fieldState: { error } }) => {
        return (
          <s.FieldWrapper colormode={colormode} sx={{ width: '100%' }}>
            <FormControl
              className={className}
              name={name}
              label={label}
              error={!!error}
              helperText={error && error.message ? error.message : helperText}
              fullWidth={fullWidth}
            >
              <s.TextInput
                sx={sx}
                className={className}
                placeholder={placeholder}
                variant={variant}
                size="small"
                type={type}
                error={!!error}
                fullWidth={fullWidth}
                multiline={multiline}
                rows={rows}
                InputProps={InputProps}
                colormode={colormode}
                id={name}
                aria-labelledby={`${name}-label`}
                aria-describedby={`${name}-helper-text`}
                {...field}
              />
            </FormControl>
          </s.FieldWrapper>
        );
      }}
    />
  );
};

export default TextInput;
