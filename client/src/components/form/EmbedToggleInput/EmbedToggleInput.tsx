import { Controller } from 'react-hook-form';
import { InputProps } from '../types';
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
  fullWidth,
  colormode = 'light'
}: InputProps & { colormode: 'light' | 'dark' }) => {
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
        <s.FormWrapper
          className={className}
          id={id}
          error={!!error}
          helperText={error && error.message ? error.message : helperText}
          helperTextId={helperTextId}
          fullWidth={fullWidth}
          colormode={colormode}
        >
          <s.FormLabel
            control={
              <s.EmbedToggleSwitch
                defaultChecked={true}
                checked={field.value}
                onChange={(e: any) => field.onChange(e.target.checked)}
                colormode={colormode}
              />
            }
            label={label}
          />
        </s.FormWrapper>
      )}
    />
  );
};

export default EmbedToggleInput;
