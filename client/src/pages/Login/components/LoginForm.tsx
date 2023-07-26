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

interface LoginFormProps {
  verified: boolean;
}

export const LoginForm = ({ verified }: LoginFormProps) => {
  const { t } = useTranslation();
  const { control, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const { login } = useAuth();

  const onSubmit = async (data: FieldValues) => {
    const { email, password } = data;
    try {
      setError(false);
      const user = await login(email, password);

      if ((user as any).uuid) {
        navigate(`/profile/${(user as any).profile_id}`);
      } else {
        navigate('/');
      }
    } catch (e: any) {
      setError(true);
    }
  };

  return (
    <>
      {verified && (
        <Typography variant="h4" component="h2" pb={4}>
          {t('Email Verified. Please login.')}
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
