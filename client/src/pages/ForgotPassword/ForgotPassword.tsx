import { Grid, Stack, Typography } from '@mui/material';
import Button from 'components/Button';
import ErrorMessage from 'components/form/ErrorMessage';
import { useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { forgotPassword } from 'api/auth';
import Link from 'components/Link';
import EmailInput from 'components/form/EmailInput';

const ForgotPassword = () => {
  const { t } = useTranslation('common');
  const { control, handleSubmit } = useForm();
  const [errorMessage, setErrorMessage] = useState('');
  const [isEmailSubmitted, setIsEmailSubmitted] = useState(false)

  const onSubmit = async (data: FieldValues) => {
    const { email } = data;
    setErrorMessage('');

    forgotPassword(email);
    setIsEmailSubmitted(true)
  };

  if(isEmailSubmitted) {
    return (
        <Grid   container  direction="column"
        alignItems="center"
        justifyContent="center" mt="4em">
            <Grid item>
        <Stack direction="column">
            <Typography component="h2">{t('Check your email for an update password link.')}</Typography>
            <Link to="/login">{t('Back to Login')}</Link>
        </Stack>
        </Grid>
        </Grid>
    )
  }

  return (
    <Grid   container  direction="column"
    alignItems="center"
    justifyContent="center" mt="4em">
        <Grid item>
            <Stack direction="column">
                <Typography component="h2">{t('Update Your Password')}</Typography>
                <EmailInput
                    name="email"
                    id="email"
                    control={control}
                    variant="outlined"
                    label={t('Email')}
                />
                {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
                    <Button color="primary" onClick={handleSubmit(onSubmit)}>
                        {t('Send Email')}
                    </Button>
            </Stack>
        </Grid>
    </Grid>
  );
};

export default ForgotPassword;
