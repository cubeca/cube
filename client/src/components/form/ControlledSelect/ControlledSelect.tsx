import {
  Box,
  FormControl,
  InputLabel,
  Select as MuiSelect
} from '@mui/material';
import { FC, ReactNode } from 'react';
import { Controller } from 'react-hook-form';
import { InputProps } from '../types';
import * as s from '../Select/Select.styled';

interface SelectProps extends InputProps {
  label: string;
  children: ReactNode;
  fullWidth?: boolean;
}

const Select: FC<SelectProps> = ({
  name,
  label,
  children,
  fullWidth,
  control,
  defaultValue
}) => {
  return (
    <Controller
      render={({ field, fieldState: { error } }) => (
        <s.Select sx={{ minWidth: 240 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">{label}</InputLabel>
            <MuiSelect
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label={label}
              fullWidth={fullWidth}
              {...field}
            >
              {children}
            </MuiSelect>
          </FormControl>
        </s.Select>
      )}
      name={name}
      control={control}
      defaultValue={defaultValue}
    />
  );
};

export default Select;
