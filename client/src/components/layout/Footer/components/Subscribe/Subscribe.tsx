import { Typography } from '@mui/material';
import EmailInput from 'components/form/EmailInput';
import { FieldValues, useForm } from 'react-hook-form';
import Button from 'components/Button';
import { useTranslation } from 'react-i18next';

import * as s from './Subscribe.styled';

const Subscribe = () => {
  
  const { control, handleSubmit } = useForm();
  const { t } = useTranslation();

  const onSubmit = async (data: FieldValues) => {
    // @Jonathan TODO: Add subscribe functionality
  }
  
  return (
    
    <s.Test>
      <Typography component="h4" variant="h4">
        {t('Sign Up For Updates')}
      </Typography>

      <Typography component="p" variant="body2">
        {t(
          'Our emails are few and far between with occasional content teasers and NFT releases.'
        )}
      </Typography>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <EmailInput
          control={control}
          name="email"
          label={t('E-mail address')}
          fullWidth
          helperText={t('E-mail address required')}
          variant="outlined"
        />
        <Button type="submit" onClick={handleSubmit(onSubmit)} fullWidth>
          {t('Sign up')}
        </Button>
      </form>
    </s.Test>

  );
};

export default Subscribe;