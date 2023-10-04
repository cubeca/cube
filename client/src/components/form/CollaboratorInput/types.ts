import { HTMLInputTypeAttribute } from 'react';

import { InputProps } from '../types';

export interface CollaboratorInputProps extends InputProps {
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
}
