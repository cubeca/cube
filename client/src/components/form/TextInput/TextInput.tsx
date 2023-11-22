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
  colorMode?: 'light' | 'dark';
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
  variant = 'outlined',
  rows,
  InputProps,
  multiline,
  colorMode = 'light'
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
          <s.FieldWrapper colorMode={colorMode}>
            <FormControl
              className={className}
              id={id}
              label={label}
              error={!!error}
              helperText={error && error.message ? error.message : helperText}
              helperTextId={helperTextId}
              fullWidth={fullWidth}
            >
              <s.TextInput
                InputLabelProps={{
                  style: {
                    color: colorMode === 'dark' ? 'red !important' : 'blue'
                  }
                }}
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
                colorMode={colorMode}
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
