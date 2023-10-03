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
import LegalModalSignup from 'components/Legal/LegalModalSignup';

export const UserSignupForm = () => {
  const { t } = useTranslation();
  const { control, handleSubmit } = useForm();
  const [displayLegal, setDisplayLegal] = useState(false);
  const [submittableData, setSubmittableData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    promotions: false,
    terms: false
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const handleSignup = async () => {
    const { firstName, lastName, email, password, promotions, terms } =
      submittableData;
    setDisplayLegal(false);
    try {
      setErrorMessage('');
      await userSignup(
        `${firstName} ${lastName}`,
        email,
        password,
        !!promotions,
        terms
      );

      setIsFormSubmitted(true);
    } catch (e: any) {
      setErrorMessage(e.response?.data || t('An Error occured during sign up'));
    }
  };
  const onSubmit = async (data: FieldValues) => {
    setSubmittableData({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      promotions: data.promotions,
      terms: data.terms
    });
    setDisplayLegal(true);
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
        {t('Sign up for a User Account')}
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
            placeholder="First"
          />
          <TextInput
            control={control}
            name="lastName"
            label={t('Last name')}
            fullWidth
            helperText={t('Last name required')}
            variant="outlined"
            placeholder="Last"
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
            placeholder="name@example.com"
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

          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
          <Box pt="1rem">
            <Button type="submit" onClick={handleSubmit(onSubmit)} fullWidth>
              {t('Review Terms and Sign up')}
            </Button>
          </Box>
        </Stack>
      </form>
      <LegalModalSignup
        callback={handleSignup}
        display={displayLegal}
        setDisplay={setDisplayLegal}
      />
    </>
  );
};
