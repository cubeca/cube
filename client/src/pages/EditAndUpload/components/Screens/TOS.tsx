import { Typography } from '@mui/material';
import ToS from 'components/Legal/ToS';
import * as DarkContent from 'components/DarkContent.styled';

import { useTranslation } from 'react-i18next';
const TOS = () => {
  const { t } = useTranslation();

  return (
    <>
      <Typography variant="h1">
        {t('Terms of Service & Privacy Policy')}
      </Typography>
      <DarkContent.Wrapper>
        <ToS />
      </DarkContent.Wrapper>
    </>
  );
};

export default TOS;
