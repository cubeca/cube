import { Box, Stack, Typography } from '@mui/material';
import EmailInput from 'components/form/EmailInput';
import ErrorMessage from 'components/form/ErrorMessage';
import PasswordInput from 'components/form/PasswordInput';
import Link from 'components/Link';
import { FieldValues, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Button from 'components/Button';
import useAuth from 'hooks/useAuth';
import { getProfile } from 'api/profile';

interface LoginFormProps {
  emailVerified?: boolean;
  passwordReset?: boolean;
}

export const LoginForm = ({ emailVerified, passwordReset }: LoginFormProps) => {
  const { t } = useTranslation();
  const { control, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const { login } = useAuth();

  const onSubmit = async (data: FieldValues) => {
    const { email, password } = data;
    try {
      setErrorMessage('');
      const user = await login(email, password);
      
      if ((user as any).profile_id) {
        const { data } = await getProfile((user as any).profile_id)
        navigate(`/profile/${(data as any).tag}`);
      } else {
        navigate('/home');
      }
    } catch (e: any) {
      setErrorMessage(e.response?.data || t('An Error occured during login'));
    }
  };

  return (
    <>
      {emailVerified && (
        <Typography variant="h4" component="h2" pb={4}>
          {t('Email Verified. Please login.')}
        </Typography>
      )}
        {passwordReset && (
        <Typography variant="h4" component="h2" pb={4}>
          {t('Password reset successful. Please login with your new password.')}
        </Typography>
      )}
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
          {errorMessage && (
            <ErrorMessage>{errorMessage}</ErrorMessage>
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
