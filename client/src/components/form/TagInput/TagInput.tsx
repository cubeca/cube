import { InputAdornment, TextField as MuiTextField } from '@mui/material';
import LabelIcon from '@mui/icons-material/Label';
import { FC, HTMLInputTypeAttribute } from 'react';
import { Controller } from 'react-hook-form';
import FormControl from '../FormControl';
import { InputProps } from '../types';
import { alpha } from '@mui/material/styles';

interface TagInputProps extends InputProps {
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  variant?: 'standard' | 'outlined';
  rows?: string | number;
  multiline?: boolean;
  hideIcon?: boolean;
}

const defaultRules = {
  required: true
};

const TextInput: FC<TagInputProps> = ({
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
  multiline,
  hideIcon
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
          <FormControl
            name={name}
            className={className}
            id={id}
            label={label}
            error={!!error}
            helperText={error && error.message ? error.message : helperText}
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
              InputProps={{
                endAdornment: !hideIcon ? (
                  <InputAdornment position="end">
                    <LabelIcon
                      style={{ fill: alpha('#D9FFEE', 0.5) }}
                    ></LabelIcon>
                  </InputAdornment>
                ) : null
              }}
              {...field}
            />
          </FormControl>
        );
      }}
    />
  );
};

export default TextInput;
