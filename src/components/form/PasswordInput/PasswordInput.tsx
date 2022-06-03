import { FC } from 'react';

import TextInput from '../TextInput';
import { TextInputProps } from '../TextInput/types';

const PasswordInput: FC<TextInputProps> = (props) => (
  <TextInput
    type="password"
    rules={{
      minLength: 15,
      maxLength: 72,
      ...props.rules!
    }}
    {...props}
  />
);

export default PasswordInput;
