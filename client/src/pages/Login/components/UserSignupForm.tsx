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
import HCaptcha from '@hcaptcha/react-hcaptcha';
import * as s from '../Login.styled';

export const UserSignupForm = () => {
  const { t } = useTranslation('common');
  const { control, handleSubmit } = useForm();
  const [displayLegal, setDisplayLegal] = useState(false);
  const [submittableData, setSubmittableData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    promotions: false,
    terms: false,
    isOver18: false
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const hCaptchaKey = process.env.REACT_APP_HCAPTCHA_KEY || '';

  const onCaptchaSuccess = () => {
    setCaptchaVerified(true);
  };

  const handleSignup = async () => {
    const {
      firstName,
      lastName,
      email,
      password,
      promotions,
      terms,
      isOver18
    } = submittableData;
    setDisplayLegal(false);
    try {
      setErrorMessage('');
      await userSignup(
        `${firstName} ${lastName}`,
        email,
        password,
        !!promotions,
        terms,
        isOver18
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
      terms: true,
      isOver18: data.ageConfirmation
    });
    setDisplayLegal(true);
  };

  if (isFormSubmitted) {
    return (
      <>
        <Typography variant="h2" component="h2" color="#D9FFEE" pb={4}>
          {t('Verify Email Header')}
        </Typography>
        <Typography variant="h4" component="h4" pb={4}>
          {t('Verify Email Body')}
        </Typography>
        <Typography variant="h3" component="h3" color="#D9FFEE" pb={4}>
          Thank you ! Merci!
        </Typography>
        <Typography variant="h4" component="h4" pb={4}>
          {t('Verify Email BodyFR')}
        </Typography>
      </>
    );
  }

  return (
    <>
      <Typography variant="h3" component="h3" pb={4}>
        {t('Sign up for a User Account')}
      </Typography>
      <Typography variant="h5" component="h5" pb={4}>
        {t('Inscrivez-vous pour un compte `User`')}
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack direction="row" spacing={2} pb={2}>
          <TextInput
            control={control}
            name="firstName"
            label={t('First name | Prénom')}
            fullWidth
            helperText={t('First name required')}
            variant="outlined"
            placeholder="First"
          />
          <TextInput
            control={control}
            name="lastName"
            label={t('Last name | Nom de famille')}
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
            label={t('E-mail')}
            fullWidth
            helperText={t('E-mail address required')}
            variant="outlined"
            placeholder="name@example.com"
          />
          <PasswordInput
            control={control}
            name="password"
            label={t('Password | Mot de passe')}
            fullWidth
            helperText={t('Password required')}
            variant="outlined"
          />
          <Typography fontSize="small" pb={4}>
            {t('Account FeesP1')}
          </Typography>
          <Typography variant="h4" color="#95F5CB" component="h4" pb={4}>
            {t('Account FeesP2')}
          </Typography>
          <Typography variant="h4" color="#95F5CB" component="h4" pb={4}>
            {t('Account FeesP2FR')}
          </Typography>
          <CheckboxInput
            control={control}
            name="ageConfirmation"
            label={t('Over 18')}
            rules={{
              required:
                'You must confirm that you are at least 18 years old. |FR| Vous devez confirmer que vous avez au moins 18 ans.'
            }}
            fullWidth
          />
          <CheckboxInput
            control={control}
            name="promotions"
            label={t('Newsletter')}
            rules={{
              required: false
            }}
            fullWidth
          />

          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}

          <Box pt="1rem">
            <HCaptcha
              theme="dark"
              sitekey={hCaptchaKey}
              onVerify={onCaptchaSuccess}
              aria-hidden="true"
            />
            <Button
              type="submit"
              disabled={!captchaVerified}
              onClick={handleSubmit(onSubmit)}
              fullWidth
            >
              {t('Review Terms | Consultez les Conditions')}
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
