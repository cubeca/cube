import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import * as s from './AuxiliaryNav.styled';

const AuxiliaryNav = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Box component="nav">
      <s.AuxButton variant="outlined" onClick={() => navigate('/login')}>
        {t('Login')}
      </s.AuxButton>
    </Box>
  );
};

export default AuxiliaryNav;
