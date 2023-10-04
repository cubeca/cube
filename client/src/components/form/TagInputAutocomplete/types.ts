import { HTMLInputTypeAttribute } from 'react';

import { InputProps } from '../types';

export interface TagInputAutocompleteProps extends InputProps {
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
}
