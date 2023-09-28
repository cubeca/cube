import { useState, useRef } from 'react';
import {
  Autocomplete,
  Chip,
  InputAdornment,
  TextField as MuiTextField
} from '@mui/material';
import LabelIcon from '@mui/icons-material/Label';
import { FC, HTMLInputTypeAttribute } from 'react';
import { Controller } from 'react-hook-form';
import FormControl from '../FormControl';
import { InputProps } from '../types';
import { alpha } from '@mui/material/styles';

interface TagInputAutocompleteProps extends InputProps {
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  variant?: 'standard' | 'outlined';
  rows?: string | number;
  multiline?: boolean;
  options: string[];
}

const defaultRules = {
  required: true
};

const TextInput: FC<TagInputAutocompleteProps> = ({
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
  options
}) => {
  const [tags, setTags] = useState<string[]>([]);
  const [autocompleteValue, setAutocompleteValue] = useState<string>('');

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
        const inputRef = useRef<HTMLInputElement>(null);

        const filteredOptions = options.filter(
          (option) => !tags.includes(option)
        );

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
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => {
                      const newTags = tags.filter((t) => t !== tag);
                      setTags(newTags);
                      field.onChange(newTags.join(', '));
                    }}
                    style={{ margin: '4px' }}
                  />
                ))}
              </div>
              <Autocomplete
                {...field}
                options={filteredOptions}
                getOptionLabel={(option) => option.toString()}
                isOptionEqualToValue={(option, value) =>
                  option.toString() === value.toString()
                }
                freeSolo={true}
                value={autocompleteValue}
                onBlur={() => {
                  field.onChange(field.value);
                  inputRef.current!.value = '';
                }}
                onChange={(event, value) => {
                  // Add the selected value as a tag and clear the input
                  if (value) {
                    const newTags = [...tags, value.toString()];
                    setTags(newTags);
                    field.onChange(newTags.join(', '));
                    console.log(newTags);
                    setAutocompleteValue('');
                    inputRef.current!.value = '';
                  } else {
                    inputRef.current!.value = '';
                  }
                }}
                // onSelect={(event, value) => {
                //   if (value) {
                //     const newTags = [...tags, value.toString()];
                //     setTags(newTags);
                //     field.onChange(newTags.join(', '));
                //     console.log(newTags);
                //     setAutocompleteValue('');
                //     inputRef.current!.value = '';
                //   } else {
                //     inputRef.current!.value = '';
                //   }
                // }}
                onInputChange={(event, value) => {
                  setAutocompleteValue(value);
                }}
                onFocus={() => {
                  // Clear the input value when the Autocomplete is focused
                  inputRef.current!.value = '';
                  setAutocompleteValue('');
                }}
                renderInput={(params) => (
                  <MuiTextField
                    {...params}
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
                      ...params.InputProps,
                      endAdornment: (
                        <InputAdornment position="end">
                          <LabelIcon
                            style={{ fill: alpha('#D9FFEE', 0.5) }}
                          ></LabelIcon>
                        </InputAdornment>
                      ),
                      inputRef: inputRef
                    }}
                  />
                )}
              />
            </div>
          </FormControl>
        );
      }}
    />
  );
};

export default TextInput;
