import { InputAdornment, IconButton } from '@mui/material';
import { t } from 'i18next';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useState } from "react";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { alpha } from '@mui/material/styles';

import TextInput from '../TextInput';
import { TextInputProps } from '../TextInput/types';

const PasswordInput: FC<TextInputProps> = (props) => {
  const { t } = useTranslation();
  const [passwordShown, setPasswordShown] = useState(false);

  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };

  return (
    <TextInput
      type={passwordShown ? "text" : "password"}
      
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={togglePassword}
            >
              {passwordShown ? <Visibility style={{ fill: alpha('#D9FFEE', 0.5) }} /> : <VisibilityOff style={{ fill: alpha('#D9FFEE', 0.5) }} />}
            </IconButton>
          </InputAdornment>
        )
      }}

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