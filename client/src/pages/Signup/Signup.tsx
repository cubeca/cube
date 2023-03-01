import { Box, Stack } from '@mui/material';
import { login } from 'api/auth';
import Button from 'components/Button';
import EmailInput from 'components/form/EmailInput';
import ErrorMessage from 'components/form/ErrorMessage';
import PasswordInput from 'components/form/PasswordInput';
import { useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { t } = useTranslation('common');
  const { control, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [error, setError] = useState(false);

  const onSubmit = async (data: FieldValues) => {
    const { email, password } = data;
    try {
      setError(false);
      const response = await login(email, password);
      // TODO: Update to a more secure method for storing token
      localStorage.setItem('TOKEN', response.data.jwt);

      // TODO: Determine profile associated with user
      navigate('/profile/1');
    } catch (e: any) {
      setError(true);
    }
  };

  return (
    <Stack py="2rem" px="4rem">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <EmailInput
            control={control}
            name="email"
            label={t('E-mail address')}
            fullWidth
            helperText={t('E-mail address required')}
          />
          <PasswordInput
            control={control}
            name="password"
            label={t('Password')}
            fullWidth
            helperText={t('Password required')}
          />
          {error && (
            <ErrorMessage>{t('Invalid username or password')}</ErrorMessage>
          )}
          <Box pt="1rem">
            <Button type="submit" onClick={handleSubmit(onSubmit)} fullWidth>
              {t('Sign Up')}
            </Button>
          </Box>
        </Stack>
      </form>
    </Stack>
  );
};

export default Login;
