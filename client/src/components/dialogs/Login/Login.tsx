import { Box, Stack } from '@mui/material';
import Button from 'components/Button';
import Dialog from 'components/Dialog';
import { DialogProps } from 'components/Dialog/Dialog';
import EmailInput from 'components/form/EmailInput';
import PasswordInput from 'components/form/PasswordInput';
import { FC, useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { login } from 'api/auth';
import ErrorMessage from 'components/form/ErrorMessage';

type LoginProps = Pick<DialogProps, 'open' | 'onClose'>;

const Login: FC<LoginProps> = ({ open, onClose }) => {
  const { t } = useTranslation('common');
  const { control, handleSubmit, reset } = useForm();
  const navigate = useNavigate();
  const [error, setError] = useState(false);

  const onSubmit = async (data: FieldValues) => {
    const { email, password } = data;
    try {
      setError(false);
      await login(email, password);

      // TODO: Determine profile associated with user
      navigate('/profile/1');
      handleClose();
    } catch (e: any) {
      setError(true);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog title={t('Sign In')} open={open} onClose={handleClose} id="sign-in">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <EmailInput
            control={control}
            name="email"
            label={t('E-mail address')}
            fullWidth
            helperText={t('E-mail address required')}
          />
          <PasswordInput
            control={control}
            name="password"
            label={t('Password')}
            fullWidth
            helperText={t('Password required')}
          />
          {error && (
            <ErrorMessage>{t('Invalid username or password')}</ErrorMessage>
          )}
          <Box pt="1rem">
            <Button type="submit" onClick={handleSubmit(onSubmit)}>
              {t('Sign In')}
            </Button>
          </Box>
        </Stack>
      </form>
    </Dialog>
  );
};

export default Login;
