import { Box, List, MenuItem } from '@mui/material';
import { useTranslation } from 'react-i18next';

const NavPanel = () => {
  const { t } = useTranslation();
  return (
    <Box
      component="nav"
      sx={{ borderBottom: 'solid 1px #ffffff' }}
      py="1rem"
      px="5rem"
    >
      <List component="ul" sx={{ display: 'flex', alignItems: 'center' }}>
        <MenuItem>{t('Home')}</MenuItem>
        <MenuItem>{t('About')}</MenuItem>
        <MenuItem>{t('Become a content creator')}</MenuItem>
        <MenuItem>{t('Creator Login')}</MenuItem>
      </List>
    </Box>
  );
};

export default NavPanel;
