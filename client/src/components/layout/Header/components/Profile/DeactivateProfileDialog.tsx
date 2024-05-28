import Dialog from 'components/Dialog';
import { useTranslation } from 'react-i18next';
import { Stack, Typography } from '@mui/material';
import Button from 'components/Button';
import { useEffect, useState } from 'react';
import { updatePassword } from 'api/auth';
import * as s from 'components/form/PasswordInput/PasswordInput.styled';
import { FieldValues, useForm } from 'react-hook-form';
import ErrorMessage from 'components/form/ErrorMessage';
import { Box } from '@mui/system';
import Grid from '@mui/system/Unstable_Grid';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import useAuth from 'hooks/useAuth';
import useEditProfile from 'pages/Profile/Edit/useEditProfile';
import { useNavigate } from 'react-router-dom';
import useProfile from 'hooks/useProfile';
import TextInput from 'components/form/TextInput';
import { deactivateProfile } from 'api/search';

interface DeactivateProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const DeactivateProfileDialog = ({
  isOpen,
  onClose
}: DeactivateProfileDialogProps) => {
  const { t } = useTranslation();
  const { control, handleSubmit, reset, watch } = useForm();
  const [errorMessage, setErrorMessage] = useState('');
  const [isProfileDeactivated, setIsProfileDeactivated] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const hCaptchaKey = process.env.REACT_APP_HCAPTCHA_KEY || '';
  const { logout } = useAuth();
  const { data: profile, isLoading, refetch } = useProfile();
  const { updateStatus } = useEditProfile(profile?.profileId || '');
  const storedProfile = JSON.parse(localStorage.getItem('PROFILE') || '{}');
  const inputValue = watch('profileTag');
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };
  const onCaptchaSuccess = () => {
    setCaptchaVerified(true);
  };

  const onSubmit = async () => {
    setErrorMessage('');
    setIsProfileDeactivated(true);

    try {
      // deactivate account
      if (profile?.profileId) {
        deactivateProfile(profile.profileId);
      }
    } catch (e: any) {
      setErrorMessage(
        e.response.data ||
          t('An error occurred while deactivating your profile.')
      );
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} id="update-email-dialog" title="">
      <Stack direction="column">
        {isProfileDeactivated ? (
          <>
            <Typography>Profile deactivated successfully!</Typography>
            <Button color="secondary" onClick={handleLogout}>
              {t('Ok')}
            </Button>
          </>
        ) : (
          <>
            {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}

            <Grid
              container
              flex-direction={{ xs: 'column', sm: 'column', md: 'row' }}
              justifyContent="space-between"
            >
              <Grid xs={12} md="auto" style={{ width: '100%' }}>
                <Typography variant="h4" sx={{ color: 'black' }}>
                  {t('Deactivate Your Profile')}
                </Typography>
                <Box mt={2}>
                  <Typography
                    variant="body2"
                    sx={{
                      display: 'flex',
                      width: '100%',
                      overflowWrap: 'break-word'
                    }}
                  >
                    {t(
                      'If you deactivate your profile your content will be deleted. You will have the option to reactivate your profile however your content will not be recovered. Please keep your email and password as your unique organizational tag will remain associated with this account even after deactivation.'
                    )}
                  </Typography>
                </Box>
                <Box mt={2}>
                  <TextInput
                    colormode="dark"
                    name="profileTag"
                    id="profileTag"
                    value={inputValue}
                    control={control}
                    fullWidth
                    variant="outlined"
                    label={t(
                      'Confirm deactivation by entering your organizational tag'
                    )}
                  />
                </Box>
              </Grid>
              <Grid
                container
                flex-direction={{ xs: 'column', sm: 'column', md: 'row' }}
                justifyContent="space-between"
                sx={{ width: '100%' }}
              >
                <Grid xs={12} md="auto">
                  <Box mt={2}>
                    <HCaptcha
                      theme="dark"
                      sitekey={hCaptchaKey}
                      onVerify={onCaptchaSuccess}
                    />
                  </Box>
                </Grid>
                <Grid xs={12} md="auto">
                  <Box mt={2}>
                    <Button
                      color="secondary"
                      disabled={
                        !captchaVerified || inputValue !== storedProfile.tag
                      }
                      onClick={onSubmit}
                    >
                      {t('Deactivate Profile')}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </>
        )}
      </Stack>
    </Dialog>
  );
};

export default DeactivateProfileDialog;
