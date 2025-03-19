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
  className?: string;
  children: ReactNode;
  onChange: (value: string | number) => void;
  id?: string;
  'aria-label'?: string;
}

const Select: FC<SelectProps> = ({ 
  label, 
  value, 
  children, 
  className, 
  onChange,
  id = 'select',
  'aria-label': ariaLabel 
}) => {
  const labelId = `${id}-label`;
  const selectId = `${id}-select`;
  
  const handleChange = (event: SelectChangeEvent<string | number>) => {
    onChange(event.target.value);
  };

  return (
    <s.Select sx={{ minWidth: 240 }} className={className}>
      <FormControl fullWidth>
        <InputLabel id={labelId}>{label}</InputLabel>
        <MuiSelect
          labelId={labelId}
          id={selectId}
          value={value}
          label={label}
          onChange={handleChange}
          aria-label={ariaLabel}
        >
          {children}
        </MuiSelect>
      </FormControl>
    </s.Select>
  );
};

export default Select;
