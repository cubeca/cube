import { Button, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Grid from '@mui/system/Unstable_Grid';
import * as s from './Footer.styled';

const Footer = ({ isLoading, handleSubmit, onSubmit }: any) => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <s.Footer className={'upload__footer'} my={theme.spacing(5)}>
      <Grid container>
        <Grid xs={10} xsOffset={1} md={6} mdOffset={3}>
          <Button
            onClick={handleSubmit(onSubmit)}
            fullWidth={false}
            disabled={isLoading}
          >
            {t('Submit')}
          </Button>
        </Grid>
      </Grid>
    </s.Footer>
  );
};

export default Footer;
