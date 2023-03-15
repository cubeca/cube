import { t } from 'i18next';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import TextInput from '../TextInput';
import { TextInputProps } from '../TextInput/types';

const PasswordInput: FC<TextInputProps> = (props) => {
  const { t } = useTranslation();
  return (
    <TextInput
      type="password"
      rules={{
        minLength: { value: 8, message: t('Minimum password length is 8') },
        maxLength: { value: 72, message: t('Maximum password length is 72') },
        ...props.rules!
      }}
      {...props}
    />
  );
};

export default PasswordInput;
