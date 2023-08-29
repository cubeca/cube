import { Grid, Stack, Typography } from '@mui/material';
import Button from 'components/Button';
import ErrorMessage from 'components/form/ErrorMessage';
import { useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { updatePassword } from 'api/auth';
import PasswordInput from 'components/form/PasswordInput';

const ResetPassword = () => {
  const { t } = useTranslation('common');
  const { token } = useParams();
  const { control, handleSubmit, reset } = useForm();
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate()

  const onSubmit = async (data: FieldValues) => {
    const { newPassword, confirmPassword } = data;
    setErrorMessage('');

    if (newPassword !== confirmPassword) {
      setErrorMessage(t('Passwords must match'));
      return;
    }

    try {
      await updatePassword({newPassword, token});
      reset()
      navigate('/login?password-reset=true')
    } catch(e: any) {
      setErrorMessage(e.response.data)
    }
  };

  return (
    <Grid container direction="column"
    alignItems="center"
    justifyContent="center">
      <Grid item>

      <Stack direction="column">
        <Typography component="h2">{t('Update Your Password')}</Typography>
          <PasswordInput
            name="newPassword"
            id="newPassword"
            control={control}
            fullWidth
            variant="outlined"
            label={t('New Password')}
          />
          <PasswordInput
            name="confirmPassword"
            id="confirmPassword"
            control={control}
            fullWidth
            variant="outlined"
            label={t('Confirm Password')}
          />
          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
          <Stack direction="row" justifyContent="right">
            <Button color="primary" onClick={handleSubmit(onSubmit)}>
              {t('Update Password')}
            </Button>
          </Stack>
      </Stack>
      </Grid>
    </Grid>
  );
};

export default ResetPassword;
