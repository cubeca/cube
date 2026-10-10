import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import TextInput from '../TextInput';
import { TextInputProps } from '../TextInput/types';

const EmailInput: FC<TextInputProps> = (props) => {
  const { t } = useTranslation();
  return (
    <TextInput
      {...props}
      colormode={props.colormode}
     rules={{
  pattern: {
    // Accepts uppercase letters and modern long TLDs like .photography
    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    message: t('Invalid Email Format')
  },
  maxLength: {
    value: 180, // the actual maximum length of an email address
    message: t('Maximum email length of 180 characters')
  }
}}
    />
  );
};

export default EmailInput;
