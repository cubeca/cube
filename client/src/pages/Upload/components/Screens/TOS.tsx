import { Typography } from '@mui/material';
import ToS from 'components/Legal/ToS';

import { useTranslation } from 'react-i18next';
const TOS = () => {
  const { t } = useTranslation();

  return (
    <>
      <Typography variant="h1">
        {t('Terms of Service & Privacy Policy')}
      </Typography>
      <ToS />
    </>
  );
};

export default TOS;
