import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import TextInput from '../TextInput';
import { TextInputProps } from '../TextInput/types';

const EmailInput: FC<TextInputProps> = (props) => {
  const { t } = useTranslation();
  return (
    <TextInput
      {...props}
      rules={{
        pattern: {
          value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
          message: t('Invalid Email Format')
        },
        minLength: {
          value: 8,
          message: t('Minimum email length of 8 characters')
        },
        maxLength: {
          value: 40,
          message: t('Maximum email length of 40 characters')
        }
      }}
    />
  );
};

export default EmailInput;
