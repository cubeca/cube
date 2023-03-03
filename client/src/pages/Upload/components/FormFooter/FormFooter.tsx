import { Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Grid from '@mui/system/Unstable_Grid';
import Button from 'components/Button';
import * as s from './FormFooter.styled';

const FormFooter = ({ isLoading, handleSubmit, onSubmit }: any) => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <s.FormFooter className={'upload__footer'} my={theme.spacing(5)}>
      <Grid container>
        <Grid xs={10} xsOffset={1} md={6} mdOffset={3}>
          <s.Messages>
            <Typography component="p" variant="body2">
              {t('"Video Title" is ready to submit!')}
            </Typography>
          </s.Messages>

          <s.Actions>
            <Button variant="outlined" fullWidth={false}>
              {t('Back')}
            </Button>

            <Button
              onClick={handleSubmit(onSubmit)}
              fullWidth={false}
              disabled={isLoading}
            >
              {t('Submit')}
            </Button>
          </s.Actions>
        </Grid>
      </Grid>
    </s.FormFooter>
  );
};

export default FormFooter;
