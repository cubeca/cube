import { Box, Grid, Stack, Typography } from '@mui/material';
import Button from 'components/Button';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const location = useLocation();
  const { search } = useLocation();

  return (
    <Stack>
        Reset Password
    </Stack>
  );
};

export default ResetPassword;
