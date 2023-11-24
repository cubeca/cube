import Dialog from 'components/Dialog';
import { FieldValues, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as s from 'components/form/EmailInput/EmailInput.styled';
import { Stack, Typography } from '@mui/material';
import Button from 'components/Button';
import { updateEmail } from 'api/auth';
import ErrorMessage from 'components/form/ErrorMessage';
import { useState } from 'react';

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
            <Stack direction="row" justifyContent="right">
              <Button color="secondary" onClick={handleSubmit(onSubmit)}>
                {t('Update Email Address')}
              </Button>
            </Stack>
          </>
        )}
      </Stack>
    </Dialog>
  );
};

export default UpdateEmailDialog;
