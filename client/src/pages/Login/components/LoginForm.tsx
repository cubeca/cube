import { Box, Stack, Typography } from '@mui/material';
import EmailInput from 'components/form/EmailInput';
import ErrorMessage from 'components/form/ErrorMessage';
import PasswordInput from 'components/form/PasswordInput';
import Link from 'components/Link';
import { FieldValues, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { login } from 'api/auth';
import { setAuthToken } from 'utils/authToken';
import { useState } from 'react';
import Button from 'components/Button';

export const LoginForm = () => {
  const { t } = useTranslation();
  const { control, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [error, setError] = useState(false);

  const onSubmit = async (data: FieldValues) => {
    const { email, password } = data;
    try {
      setError(false);
      const jwt = await login(email, password);
      // TODO: Update to a more secure method for storing token
      setAuthToken(jwt);

      // TODO: Determine profile associated with user
      navigate('/profile/1');
    } catch (e: any) {
      setError(true);
    }
  };

  return (
    <>
      <Typography variant="h3" component="h3" pb={4}>
        {t('Account Login')}
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <EmailInput
            control={control}
            name="email"
            label={t('E-mail address')}
            fullWidth
            helperText={t('E-mail address required')}
            variant="outlined"
          />
          <PasswordInput
            control={control}
            name="password"
            label={t('Password')}
            fullWidth
            helperText={t('Password required')}
            variant="outlined"
          />
          {error && (
            <ErrorMessage>{t('Invalid username or password')}</ErrorMessage>
          )}
          <Box pt="1rem">
            <Button type="submit" onClick={handleSubmit(onSubmit)} fullWidth>
              {t('Login')}
            </Button>
            <Box pt={4}>
              <Link to="/forgot-password">{t('Forgot Password?')}</Link>
            </Box>
          </Box>
        </Stack>
      </form>
    </>
  );
};
