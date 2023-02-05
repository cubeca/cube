import { Box, List, MenuItem } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ArrowForwardIcon from '@mui/icons-material/ArrowForwardIos';

import * as s from './NavPanel.styled';

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
        <MenuItem sx={{ margin: '0 2rem' }}>
          <s.NavLink to="/">{t('Home')}</s.NavLink>
        </MenuItem>
        <ArrowForwardIcon />
        <MenuItem sx={{ margin: '0 2rem' }}>
          <s.NavLink to="/about">{t('About')}</s.NavLink>
        </MenuItem>
        <ArrowForwardIcon />
        <MenuItem sx={{ margin: '0 2rem' }}>
          <s.NavLink to="/join">{t('Become a content creator')}</s.NavLink>
        </MenuItem>
        <ArrowForwardIcon />
        <MenuItem sx={{ margin: '0 2rem' }}>
          <s.NavLink to="/login">{t('Creator Login')}</s.NavLink>
        </MenuItem>
      </List>
    </Box>
  );
};

export default NavPanel;
