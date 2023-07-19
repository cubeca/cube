import Dialog from 'components/Dialog';
import { useTranslation } from 'react-i18next';
import { Stack } from '@mui/material';
import Button from 'components/Button';
import { useEffect } from 'react';
import { forgotPassword } from 'api/auth';

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

  useEffect(() => {
    console.log(email, isOpen);
    if (email && isOpen) {
      forgotPassword(email);
    }
  }, [email, isOpen]);

  return (
    <Dialog open={isOpen} onClose={onClose} id="update-email-dialog" title="">
      <Stack direction="column">
        {t('Password reset link sent to email address for this account.')}
        <Stack direction="row" justifyContent="right">
          <Button color="secondary" onClick={onClose}>
            {t('OK')}
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default ChangePasswordDialog;
