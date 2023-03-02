import { HTMLInputTypeAttribute } from 'react';

import { InputProps } from '../types';

export interface TextInputProps extends InputProps {
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  variant?: 'standard' | 'outlined';
}
