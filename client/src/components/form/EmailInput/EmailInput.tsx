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
          value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
          message: t('Invalid Email Format')
        },
        minLength: {
          value: 6,
          message: t('Minimum email length of 6 characters')
        },
        maxLength: {
          value: 140,
          message: t('Maximum email length of 140 characters')
        }
      }}
    />
  );
};

export default EmailInput;
