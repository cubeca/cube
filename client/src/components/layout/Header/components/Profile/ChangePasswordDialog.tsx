import Dialog from 'components/Dialog';
import { useTranslation } from 'react-i18next';
import { Stack, Typography } from '@mui/material';
import Button from 'components/Button';
import { useContext, useState } from 'react';
import { updatePassword } from 'api/auth';
import * as s from 'components/form/PasswordInput/PasswordInput.styled';
import { FieldValues, useForm } from 'react-hook-form';
import ErrorMessage from 'components/form/ErrorMessage';
import { UserContext } from 'providers/UserProvider';

interface ChangePasswordDialogProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
}

const ChangePasswordDialog = ({
  isOpen,
  onClose,
  email
}: ChangePasswordDialogProps) => {
  const { t } = useTranslation();
  const { control, handleSubmit, reset } = useForm();
  const [errorMessage, setErrorMessage] = useState('');
  const { user } = useContext(UserContext);
  const [isPasswordUpdated, setIsPasswordUpdated] = useState(false);

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
              colorMode="dark"
            />
            <s.StyledPasswordInput
              name="newPassword"
              id="newPassword"
              control={control}
              fullWidth
              variant="outlined"
              label={t('New Password')}
              colorMode="dark"
            />
            <s.StyledPasswordInput
              name="confirmPassword"
              id="confirmPassword"
              control={control}
              fullWidth
              variant="outlined"
              label={t('Confirm Password')}
              colorMode="dark"
            />
            {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
            <Stack direction="row" justifyContent="right">
              <Button color="secondary" onClick={handleSubmit(onSubmit)}>
                {t('Update Password')}
              </Button>
            </Stack>
          </>
        )}
      </Stack>
    </Dialog>
  );
};

export default ChangePasswordDialog;
