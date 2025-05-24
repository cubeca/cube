import { FC } from 'react';
import { Controller } from 'react-hook-form';
import FormControl from '../FormControl';
import { InputProps } from '../types';
import {
  Box,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup
} from '@mui/material';

interface Option {
  label: string;
  value: string;
  id: string;
}

interface RadioInputProps extends InputProps {
  options: Option[];
  direction?: 'vertical' | 'horizontal';
}

const defaultRules = {
  required: true
};

const RadioInput: FC<RadioInputProps> = ({
  options = [],
  name,
  control,
  rules,
  defaultValue,
  className,
  id,
  label,
  helperText,
  helperTextId,
  fullWidth,
  direction = 'horizontal'
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
          <Box pb="1rem">
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
              <RadioGroup aria-label={name} {...field}>
                {options.map(({ label, id, value }) => (
                  <FormControlLabel
                    key={id}
                    value={value}
                    control={<Radio color="secondary" />}
                    label={label}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Box>
        );
      }}
    />
  );
};

export default RadioInput;
