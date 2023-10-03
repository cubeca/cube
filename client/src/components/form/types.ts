import { InputProps as MuiInputProps } from '@mui/material';
import { ReactNode } from 'react';
import { Control } from 'react-hook-form';

export interface InputProps extends MuiInputProps {
  label?: any;
  name: string;
  control: Control;
  defaultValue?: string;
  rules?: Record<string, unknown>;
  errorMessage?: ReactNode | string;
  className?: string;
  id?: string;
  helperText?: string;
  helperTextId?: string;
}
