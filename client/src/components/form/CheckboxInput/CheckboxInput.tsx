import { Controller } from 'react-hook-form';
import FormControl from '../FormControl';
import { InputProps } from '../types';
import { Checkbox, FormControlLabel } from '@mui/material';

const defaultRules = {
  required: true
};

const CheckboxInput = ({
  name,
  control,
  rules,
  defaultValue,
  className,
  id,
  label,
  helperText,
  helperTextId,
  fullWidth
}: InputProps) => (
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
        error={!!error}
        helperText={error && error.message ? error.message : helperText}
        helperTextId={helperTextId}
        fullWidth={fullWidth}
      >
        <FormControlLabel
          control={
            <Checkbox
              checked={field.value}
              onChange={(e) => field.onChange(e.target.checked)}
            />
          }
          label={label}
        />
      </FormControl>
    )}
  />
);

export default CheckboxInput;