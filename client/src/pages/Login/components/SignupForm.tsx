import { Box, Stack, Typography } from '@mui/material';
import EmailInput from 'components/form/EmailInput';
import ErrorMessage from 'components/form/ErrorMessage';
import PasswordInput from 'components/form/PasswordInput';
import { FieldValues, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { signup } from 'api/auth';
import { useState } from 'react';
import Button from 'components/Button';
import TextInput from 'components/form/TextInput';
import CheckboxInput from 'components/form/CheckboxInput';

export const SignupForm = () => {
  const { t } = useTranslation();
  const { control, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [error, setError] = useState(false);

  const onSubmit = async (data: FieldValues) => {
    const {
      firstName,
      lastName,
      email,
      password,
      promotions,
      terms,
      organization,
      website,
      tag
    } = data;
    try {
      setError(false);
      await signup(
        `${firstName} ${lastName}`,
        organization,
        website,
        tag,
        email,
        password,
        [],
        !!promotions,
        terms
      );

      navigate('/login');
    } catch (e: any) {
      setError(true);
    }
  };

  return (
    <>
      <Typography variant="h3" component="h3" pb={4}>
        {t('Sign up')}
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
          <TextInput
            control={control}
            name="organization"
            label={t('Organization name')}
            fullWidth
            helperText={t('Organization name required')}
            variant="outlined"
          />
          <TextInput
            control={control}
            name="website"
            label={t('Website')}
            fullWidth
            helperText={t('Website required')}
            variant="outlined"
          />
          <TextInput
            control={control}
            name="tag"
            label={t('Organization Tag')}
            fullWidth
            helperText={t('Tag required')}
            variant="outlined"
            placeholder="@OrgName"
          />
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
