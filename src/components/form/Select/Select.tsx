import {
  Box,
  FormControl,
  InputLabel,
  Select as MuiSelect,
  SelectChangeEvent
} from '@mui/material';
import { FC, ReactNode } from 'react';

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
    <Box sx={{ minWidth: 240 }}>
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
    </Box>
  );
};

export default Select;
