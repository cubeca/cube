import { Box, List, MenuItem } from '@mui/material';
import { TFunction, useTranslation } from 'react-i18next';

const getNavItems = (t: TFunction<'translation', undefined>) => [
  {
    text: t('Home'),
    path: '/'
  },
  {
    text: t('About'),
    path: '/about'
  },
  {
    text: t('Become a content creator'),
    path: '/join'
  },
  {
    text: t('Creator Login'),
    path: '/login'
  }
];

const NavPanel = () => {
  const { t } = useTranslation();
  const navItems = getNavItems(t);
  return (
    <Box component="nav">
      <List
        component="ul"
        sx={{ display: 'flex', alignItems: 'center' }}
      >
        {navItems.map((item) => (
          <MenuItem key={item.path}>{item.text}</MenuItem>
        ))}
      </List>
    </Box>
  );
};

export default NavPanel;
