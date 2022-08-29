import { Box, Stack } from '@mui/material';
import Button from 'components/Button';
import Dialog from 'components/Dialog';
import { DialogProps } from 'components/Dialog/Dialog';
import EmailInput from 'components/form/EmailInput';
import PasswordInput from 'components/form/PasswordInput';
import { FC } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

type LoginProps = Pick<DialogProps, 'open' | 'onClose'>;

const Login: FC<LoginProps> = ({ open, onClose }) => {
  const { t } = useTranslation('common');
  const { control, handleSubmit, reset } = useForm();
  const navigate = useNavigate();

  const onSubmit = (data: FieldValues) => {
    console.log(data);
    handleClose();
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
          <Box pt="1rem">
            <Button
              type="submit"
              onClick={() => {
                navigate('/profile/1');
                handleClose();
              }}
            >
              {t('Sign In')}
            </Button>
          </Box>
        </Stack>
      </form>
    </Dialog>
  );
};

export default Login;
