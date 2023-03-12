import { HTMLInputTypeAttribute } from 'react';

import { InputProps } from '../types';

export interface TagInputProps extends InputProps {
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
}
