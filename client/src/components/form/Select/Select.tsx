import {
  Box,
  FormControl,
  InputLabel,
  Select as MuiSelect,
  SelectChangeEvent
} from '@mui/material';
import { FC, ReactNode } from 'react';
import * as s from './Select.styled';

interface SelectProps {
  label: string;
  value?: string | number;
  children: ReactNode;
  onChange: (value: string | number) => void;
}

const Select: FC<SelectProps> = ({ label, value, children, onChange }) => {
  const handleChange = (event: SelectChangeEvent<string | number>) => {
    onChange(event.target.value);
  };

  return (
    <s.Select sx={{ minWidth: 240 }} className="glancedigital">
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">{label}</InputLabel>
        <MuiSelect
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={value}
          label={label}
          onChange={handleChange}
        >
          {children}
        </MuiSelect>
      </FormControl>
    </s.Select>
  );
};

export default Select;
