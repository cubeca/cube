import Dialog from 'components/Dialog';
import { useTranslation } from 'react-i18next';
import { Stack, Typography } from '@mui/material';
import Button from 'components/Button';
import { useState } from 'react';
import { updatePassword } from 'api/auth';
import * as s from 'components/form/PasswordInput/PasswordInput.styled';
import { FieldValues, useForm } from 'react-hook-form';
import ErrorMessage from 'components/form/ErrorMessage';
import { Box } from '@mui/system';
import Grid from '@mui/system/Unstable_Grid';
import HCaptcha from '@hcaptcha/react-hcaptcha';

interface ChangePasswordDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChangePasswordDialog = ({
  isOpen,
  onClose
}: ChangePasswordDialogProps) => {
  const { t } = useTranslation();
  const { control, handleSubmit, reset } = useForm();
  const [errorMessage, setErrorMessage] = useState('');
  const [isPasswordUpdated, setIsPasswordUpdated] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const hCaptchaKey = process.env.REACT_APP_HCAPTCHA_KEY || '';

  const onCaptchaSuccess = () => {
    setCaptchaVerified(true);
  };

  const onSubmit = async (data: FieldValues) => {
    const { currentPassword, newPassword, confirmPassword } = data;
    setErrorMessage('');

    if (newPassword !== confirmPassword) {
      setErrorMessage(t('Passwords must match.'));
      return;
    }
    try {
      updatePassword({ currentPassword, newPassword });
      reset();
      setIsPasswordUpdated(true);
    } catch (e: any) {
      setErrorMessage(
        e.response.data || t('An error occurred while updating password')
      );
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} id="update-email-dialog" title="">
      <Stack direction="column">
        {isPasswordUpdated ? (
          <>
            <Typography>Password Updated</Typography>
            <Button color="secondary" onClick={onClose}>
              {t('Ok')}
            </Button>
          </>
        ) : (
          <>
            <s.StyledPasswordInput
              name="currentPassword"
              id="currentPassword"
              control={control}
              fullWidth
              variant="outlined"
              label={t('Current Password')}
              colormode="dark"
            />
            <s.StyledPasswordInput
              name="newPassword"
              id="newPassword"
              control={control}
              fullWidth
              variant="outlined"
              label={t('New Password')}
              colormode="dark"
            />
            <s.StyledPasswordInput
              name="confirmPassword"
              id="confirmPassword"
              control={control}
              fullWidth
              variant="outlined"
              label={t('Confirm Password')}
              colormode="dark"
            />
            {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}

            <Grid
              container
              flex-direction={{ xs: 'column', sm: 'column', md: 'row' }}
              justifyContent="space-between"
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
                    disabled={!captchaVerified}
                    onClick={handleSubmit(onSubmit)}
                  >
                    {t('Update Password')}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </>
        )}
      </Stack>
    </Dialog>
  );
};

export default ChangePasswordDialog;
