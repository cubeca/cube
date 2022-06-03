import { FC } from 'react';

import TextInput from '../TextInput';
import { TextInputProps } from '../TextInput/types';

const EmailInput: FC<TextInputProps> = (props) => (
  <TextInput
    {...props}
    rules={{
      pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
      minLength: 8,
      maxLength: 40
    }}
  />
);

export default EmailInput;
