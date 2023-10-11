import { InputAdornment, TextField as MuiTextField } from '@mui/material';
import LabelIcon from '@mui/icons-material/Label';
import { FC, HTMLInputTypeAttribute, useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';
import FormControl from '../FormControl';
import { InputProps } from '../types';
import { alpha } from '@mui/material/styles';
import { Autocomplete } from '@mui/material';
import { useTranslation } from 'react-i18next';
import useCollaborators from 'hooks/useCollaborators';

interface CollaboratorInputProps extends InputProps {
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  variant?: 'standard' | 'outlined';
  rows?: string | number;
  multiline?: boolean;
}

const defaultRules = {
  required: true
};

const CollaboratorInput: FC<CollaboratorInputProps> = ({
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
  multiline
}) => {
  const { t } = useTranslation();

  const [allCollaborators, setAllCollaborators] = useState<string[]>([]);
  const [collaboratorMap, setCollaboratorMap] = useState<
    Record<string, string>
  >({});
  const { data: collaborators, isLoading: isCollaboratorsLoading } =
    useCollaborators();

  useEffect(() => {
    if (collaborators) {
      const newCollaboratorMap = collaborators.reduce(
        (acc: Record<string, string>, collaborator) => {
          acc[collaborator.organization] = collaborator.id;
          return acc;
        },
        {}
      );

      setCollaboratorMap(newCollaboratorMap);
      setAllCollaborators(Object.keys(newCollaboratorMap));
    }
  }, [collaborators]);

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
        const value = field.value;
        const lastWord = value ? value.split(/,\s+/).pop().trim() : '';

        const filteredOptions = allCollaborators.filter((option) =>
          option.toLowerCase().startsWith(lastWord.toLowerCase())
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
            <Autocomplete
              {...field}
              options={filteredOptions}
              getOptionLabel={(option) => option.toString()}
              isOptionEqualToValue={(option, value) =>
                option.toString() === value.toString()
              }
              freeSolo={true}
              value={field.value || ''}
              onBlur={() => {
                field.onChange(field.value);
              }}
              onChange={(event, value) => {
                const selectedId = collaboratorMap[value];
                field.onChange(selectedId);
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
                    )
                  }}
                />
              )}
            />
          </FormControl>
        );
      }}
    />
  );
};

export default CollaboratorInput;
