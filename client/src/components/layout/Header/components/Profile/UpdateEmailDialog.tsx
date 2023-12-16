import Dialog from 'components/Dialog';
import { FieldValues, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as s from 'components/form/EmailInput/EmailInput.styled';
import { Stack, Typography } from '@mui/material';
import Button from 'components/Button';
import { updateEmail } from 'api/auth';
import ErrorMessage from 'components/form/ErrorMessage';
import { useState } from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import Grid from '@mui/system/Unstable_Grid';
import { Box } from '@mui/system';

interface UpdateEmailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

const UpdateEmailDialog = ({
  isOpen,
  onClose,
  userId
}: UpdateEmailDialogProps) => {
  const { t } = useTranslation();
  const { control, handleSubmit, reset } = useForm();
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const hCaptchaKey = process.env.REACT_APP_HCAPTCHA_KEY || '';

  const onCaptchaSuccess = () => {
    setCaptchaVerified(true);
  };

  const onSubmit = async (data: FieldValues) => {
    const { newEmail, confirmEmail } = data;
    setErrorMessage('');

    if (newEmail !== confirmEmail) {
      setErrorMessage(t('Emails must match.'));
      return;
    }

    try {
      await updateEmail(userId, newEmail);
      reset();
      setIsSubmitted(true);
    } catch (e: any) {
      setErrorMessage(e.response.data);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      id="update-email-dialog"
      title=""
    >
      <Stack direction="column">
        <Typography component="h2">{t('Update Email Address')}</Typography>
        {isSubmitted ? (
          <>
            <Typography component="h3">
              {t('Check your Email for a verification link.')}
            </Typography>
            <Stack direction="row" justifyContent="right">
              <Button color="secondary" onClick={onClose}>
                {t('Ok')}
              </Button>
            </Stack>
          </>
        ) : (
          <>
            <s.StyledEmailInput
              name="newEmail"
              id="newEmail"
              control={control}
              fullWidth
              variant="outlined"
              label={t('New Email')}
              colorMode="dark"
            />
            <s.StyledEmailInput
              name="confirmEmail"
              id="confirmEmail"
              control={control}
              fullWidth
              variant="outlined"
              label={t('Confirm Email')}
              colorMode="dark"
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
                    {t('Update Email Address')}
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

export default UpdateEmailDialog;
