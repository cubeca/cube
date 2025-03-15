/**
 * `ForgotPassword` provides a user interface for requesting a password reset.
 * The component includes an email input field, an hCaptcha for bot protection, and a submit button.
 * Upon successful captcha verification and form submission, it calls the `forgotPassword` API function with the user's email.
 * If the API call is successful, it updates the state to indicate that the email has been submitted.
 * In case of an error, it displays an error message.
 */

import { Grid, Stack, Typography } from '@mui/material';
import Button from 'components/Button';
import ErrorMessage from 'components/form/ErrorMessage';
import { useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { forgotPassword } from 'api/auth';
import Link from 'components/Link';
import EmailInput from 'components/form/EmailInput';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { Box } from '@mui/system';
import { useDocumentTitle } from 'hooks/useDocumentTitle';

const ForgotPassword = () => {
  const { t } = useTranslation('common');
    // Use translation for accessibility and bilingual support
    useDocumentTitle(t('forgotPassword.pageTitle', 'Password Recovery'));
  const { control, handleSubmit } = useForm();
  const [errorMessage, setErrorMessage] = useState('');
  const [isEmailSubmitted, setIsEmailSubmitted] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const hCaptchaKey = process.env.REACT_APP_HCAPTCHA_KEY || '';

  const onCaptchaSuccess = () => {
    setCaptchaVerified(true);
  };

  const onSubmit = async (data: FieldValues) => {
    const { email } = data;
    setErrorMessage('');

    try {
      await forgotPassword(email);
      setIsEmailSubmitted(true);
    } catch (e: any) {
      setErrorMessage('Sorry, no account found with that email address.');
    }
  };

  if (isEmailSubmitted) {
    return (
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
        mt="4em"
      >
        <Grid item>
          <Stack direction="column">
            <Typography component="h2">
              {t('Check your email for an update password link.')}
            </Typography>
            <Link to="/login">{t('Back to Login')}</Link>
          </Stack>
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      justifyContent="center"
      mt="4em"
    >
      <Grid item>
        <Stack direction="column">
          <Typography component="h2">
            {t('Enter your email below to receieve a password reset link')}
          </Typography>
          <EmailInput
            name="email"
            id="email"
            control={control}
            variant="outlined"
            label={t('Email')}
            fullWidth
          />
          {errorMessage ? (
            <Box width="90%" mt={-2} mb={4}>
              <ErrorMessage>{errorMessage}</ErrorMessage>
            </Box>
          ) : null}

          <HCaptcha
            theme="dark"
            sitekey={hCaptchaKey}
            onVerify={onCaptchaSuccess}
          />
          <Button
            color="primary"
            disabled={!captchaVerified}
            onClick={handleSubmit(onSubmit)}
          >
            {t('Send Email')}
          </Button>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default ForgotPassword;
