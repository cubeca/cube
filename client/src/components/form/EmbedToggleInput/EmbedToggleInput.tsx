import { Controller } from 'react-hook-form';
import { InputProps } from '../types';
import { Switch } from '@mui/material';
import * as s from './EmbedToggleInput.styled';

const defaultRules = {
  required: false
};

const EmbedToggleInput = ({
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
      <s.FormWrapper
        className={className}
        id={id}
        error={!!error}
        helperText={error && error.message ? error.message : helperText}
        helperTextId={helperTextId}
        fullWidth={fullWidth}
      >
        <s.FormLabel
          control={
            <Switch
              defaultChecked={true}
              checked={field.value}
              onChange={(e) => field.onChange(e.target.checked)}
            />
          }
          label={label}
        />
      </s.FormWrapper>
    )}
  />
);

export default EmbedToggleInput;
