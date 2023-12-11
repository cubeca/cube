import { Box, Stack, Typography } from '@mui/material';
import EmailInput from 'components/form/EmailInput';
import ErrorMessage from 'components/form/ErrorMessage';
import PasswordInput from 'components/form/PasswordInput';
import { FieldValues, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { creatorSignup } from 'api/auth';
import { useState } from 'react';
import Button from 'components/Button';
import TextInput from 'components/form/TextInput';
import CheckboxInput from 'components/form/CheckboxInput';
import LegalModalSignup from 'components/Legal/LegalModalSignup';
import HCaptcha from '@hcaptcha/react-hcaptcha';

export const CreatorSignupForm = () => {
  const { t } = useTranslation();
  const { control, handleSubmit } = useForm();
  const [displayLegal, setDisplayLegal] = useState(false);
  const [submittableData, setSubmittableData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    promotions: false,
    terms: false,
    organization: '',
    website: '',
    tag: '',
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
      organization,
      website,
      tag,
      isOver18
    } = submittableData;
    setDisplayLegal(false);
    try {
      setErrorMessage('');
      await creatorSignup(
        `${firstName} ${lastName}`,
        organization,
        website,
        tag.startsWith('@') ? tag.substring(1) : tag,
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
      terms: data.terms,
      organization: data.organization,
      website: data.website,
      tag: data.tag,
      isOver18: data.ageConfirmation
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

  if (isFormSubmitted) {
    return (
      <Typography>
        Application Submitted! If approved, you will receive a verification link
        to the email address you provided.
      </Typography>
    );
  }

  return (
    <>
      <Typography variant="h3" component="h3" pb={4}>
        {t('Apply for a Creator Account')}
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
          <TextInput
            control={control}
            name="organization"
            label={t('Organization name')}
            fullWidth
            helperText={t('Organization name required')}
            variant="outlined"
            placeholder="Organization"
          />
          <TextInput
            control={control}
            name="website"
            label={t('Website')}
            fullWidth
            helperText={t('Website required')}
            variant="outlined"
            placeholder="https://www.example.com"
          />
          <TextInput
            control={control}
            name="tag"
            label={t('Organization Tag')}
            fullWidth
            helperText={t('Tag required')}
            variant="outlined"
            placeholder="OrgName"
          />
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
            name="ageConfirmation"
            label={t('I am 18 years of age or older.')}
            rules={{
              required:
                'Unfortunately you cannot create a profile on CubeCommons unless you are 18+ years old.'
            }}
            fullWidth
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
            <HCaptcha sitekey={hCaptchaKey} onVerify={onCaptchaSuccess} />
            <Button
              type="submit"
              disabled={!captchaVerified}
              onClick={handleSubmit(onSubmit)}
              fullWidth
            >
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
