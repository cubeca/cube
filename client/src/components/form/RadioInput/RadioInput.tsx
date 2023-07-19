import { FC } from 'react';
import { Controller } from 'react-hook-form';
import FormControl from '../FormControl';
import { InputProps } from '../types';
import { Box, RadioGroup } from '@mui/material';

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
          <FormControl
            className={className}
            id={id}
            label={label}
            error={!!error}
            helperText={error && error.message ? error.message : helperText}
            helperTextId={helperTextId}
            fullWidth={fullWidth}
          >
            <Box
              pb="1rem"
              display="flex"
              flexDirection={direction === 'horizontal' ? 'row' : 'column'}
            >
              <RadioGroup aria-label={name}>
                {options.map(({ label, id, value }) => (
                  <label
                    htmlFor="field-wind"
                    key={id}
                    style={{ marginRight: '5px' }}
                  >
                    <input type="radio" id={id} {...field} value={value} />
                    {label}
                  </label>
                ))}
              </RadioGroup>
            </Box>
          </FormControl>
        );
      }}
    />
  );
};

export default RadioInput;
