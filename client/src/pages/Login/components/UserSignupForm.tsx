import { Box, Stack, Typography } from '@mui/material';
import EmailInput from 'components/form/EmailInput';
import ErrorMessage from 'components/form/ErrorMessage';
import PasswordInput from 'components/form/PasswordInput';
import { FieldValues, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { userSignup } from 'api/auth';
import { useState } from 'react';
import Button from 'components/Button';
import TextInput from 'components/form/TextInput';
import CheckboxInput from 'components/form/CheckboxInput';

export const UserSignupForm = () => {
  const { t } = useTranslation();
  const { control, handleSubmit } = useForm();
  const [error, setError] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const onSubmit = async (data: FieldValues) => {
    const { firstName, lastName, email, password, promotions, terms } = data;
    try {
      setError(false);
      await userSignup(
        `${firstName} ${lastName}`,
        email,
        password,
        !!promotions,
        terms
      );

      setIsFormSubmitted(true);
    } catch (e: any) {
      setError(true);
    }
  };

  if (isFormSubmitted) {
    return (
      <Typography>
        Sign up Successful! Check the email address you provided for your
        verification link.
      </Typography>
    );
  }

  return (
    <>
      <Typography variant="h3" component="h3" pb={4}>
        {t('User Sign up')}
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack direction="row" spacing={2} pb={2}>
          <TextInput
            control={control}
            name="firstName"
            label={t('First name')}
            fullWidth
            helperText={t('First name required')}
            variant="outlined"
          />
          <TextInput
            control={control}
            name="lastName"
            label={t('Last name')}
            fullWidth
            helperText={t('Last name required')}
            variant="outlined"
          />
        </Stack>
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
          <CheckboxInput
            control={control}
            name="promotions"
            label={t(
              'I would like to receive Cube Commons newsletters and other promotional information.'
            )}
            rules={{
              required: false
            }}
            fullWidth
          />
          <CheckboxInput
            control={control}
            name="terms"
            label={t(
              `I agree to creating a Cube Commons account, and I agree to Cube Commons' Terms of Use and Privacy Policy (required).`
            )}
            fullWidth
            helperText={t(
              'You must agree to the Terms of Use and Privacy Policy to continue'
            )}
          />
          {error && (
            <ErrorMessage>{t('Error occurred during sign up')}</ErrorMessage>
          )}
          <Box pt="1rem">
            <Button type="submit" onClick={handleSubmit(onSubmit)} fullWidth>
              {t('Sign up')}
            </Button>
          </Box>
        </Stack>
      </form>
    </>
  );
};
