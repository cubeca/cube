import { Grid, Stack, Typography } from '@mui/material';
import Button from 'components/Button';
import ErrorMessage from 'components/form/ErrorMessage';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Link from 'components/Link';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { Box } from '@mui/system';
import useEditProfile from 'pages/Profile/Edit/useEditProfile';
import useProfile from 'hooks/useProfile';

const ReactivateProfile = () => {
  const { t } = useTranslation('common');
  const { control, handleSubmit } = useForm();
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const storedProfile = JSON.parse(localStorage.getItem('PROFILE') || '{}');
  const hCaptchaKey = process.env.REACT_APP_HCAPTCHA_KEY || '';
  const { data: profile, isLoading, refetch } = useProfile();
  const { updateStatus } = useEditProfile(profile?.profileId || '');

  const onCaptchaSuccess = () => {
    setCaptchaVerified(true);
  };

  const reactivateProfile = (id: any, status: any) => {
    updateStatus(id, status);
  };
  const onSubmit = async () => {
    setErrorMessage('');

    try {
      reactivateProfile(profile?.profileId, 'active');
      setIsSubmitted(true);
      refetch();
      // update local storage to show profile is active
      const storedProfile = JSON.parse(localStorage.getItem('PROFILE') || '{}');
      storedProfile.status = 'active';
      localStorage.setItem('PROFILE', JSON.stringify(storedProfile));
    } catch (e: any) {
      setErrorMessage(
        'There was an error when trying to reactivate your profile.'
      );
    }
  };

  if (isSubmitted) {
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
              {t(
                "Your profile has been reactivated.  Click 'OK' to go to your profile."
              )}
            </Typography>

            <Button
              color="primary"
              disabled={!captchaVerified}
              onClick={onSubmit}
              href={`/profile/${storedProfile.tag}`}
            >
              {t('OK')}
            </Button>
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
        <Typography variant="h4" my={2}>
          {t('Reactivate Profile')}
        </Typography>
        <Stack direction="column" sx={{ maxWidth: '600px' }}>
          <Typography component="h2">
            {t(
              'Click below to reactivate your profile. Remember, your previous content will not reappear. Cheers to new beginnings!'
            )}
          </Typography>
          {errorMessage ? (
            <Box width="90%" mt={-2} mb={4}>
              <ErrorMessage>{errorMessage}</ErrorMessage>
            </Box>
          ) : null}
          <Box mb={2}>
            <HCaptcha
              theme="dark"
              sitekey={hCaptchaKey}
              onVerify={onCaptchaSuccess}
            />
          </Box>
          <Button
            color="primary"
            disabled={!captchaVerified}
            onClick={onSubmit}
          >
            {t('Reactivate Profile')}
          </Button>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default ReactivateProfile;
