import { Box, List, MenuItem } from '@mui/material';
import { useTranslation } from 'react-i18next';
// import ArrowForwardIcon from '@mui/icons-material/ArrowForwardIos';

import * as s from './NavPanel.styled';

const NavPanel = () => {
  const { t } = useTranslation();
  return (
    <Box
      component="nav"
      sx={{display: 'flex', flexDirection: 'column',  }}>
      <List component="ul" sx={{alignItems: 'center' }}>
        <MenuItem sx={{ margin: '0 2rem' }}>
          <s.NavLink to="/">{t('Start Watching')}</s.NavLink>
        </MenuItem>
        
        <MenuItem sx={{ margin: '0 2rem' }}>
          <s.NavLink to="/about">{t('About')}</s.NavLink>
        </MenuItem>

        <MenuItem sx={{ margin: '0 2rem' }}>
          <s.NavLink to="/">{t('Contact Us')}</s.NavLink>
        </MenuItem>

        <MenuItem sx={{ margin: '0 2rem' }}>
          <s.NavLink to="/signup">{t('Become a Creator')}</s.NavLink>
        </MenuItem>
      
        <MenuItem sx={{ margin: '0 2rem' }}>
          <s.NavLink to="/">{t('FAQs')}</s.NavLink>
        </MenuItem>
      </List>
    </Box>
  );
};

export default NavPanel;
