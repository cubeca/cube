import { FC } from 'react';
import { Controller } from 'react-hook-form';
import FormControl from '../FormControl';
import { InputProps } from '../types';
import { Box, Chip, TextField } from '@mui/material';

interface ChipInputProps extends InputProps {
  chips?: string[];
}

const defaultRules = {
  required: true
};

const ChipInput: FC<ChipInputProps> = ({
  chips = [],
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
  placeholder
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
          <TextField
            placeholder={placeholder}
            variant="outlined"
            size="medium"
            type="text"
            error={!!error}
            fullWidth={fullWidth}
            {...field}
          />
          <Box pt="1rem">
            {chips.map((label) => (
              <Chip
                key={label}
                label={label}
                variant="outlined"
                sx={{
                  marginBottom: '0.5rem',
                  marginRight: '0.5rem',
                  cursor: 'pointer'
                }}
              />
            ))}
          </Box>
        </FormControl>
      )}
    />
  );
};

export default ChipInput;
