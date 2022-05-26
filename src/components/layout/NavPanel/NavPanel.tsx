import { Box, List, MenuItem } from '@mui/material';

const getNavItems = () => [
  {
    text: 'Home',
    path: '/'
  },
  {
    text: 'About',
    path: '/about'
  },
  {
    text: 'Become a content creator',
    path: '/join'
  },
  {
    text: 'Creator Login',
    path: '/login'
  }
];

const NavPanel = () => {
  const navItems = getNavItems();
  return (
    <Box component="nav">
      <List component="ul" sx={{ display: 'flex', alignItems: 'center' }}>
        {navItems.map((item) => (
          <MenuItem key={item.path}>{item.text}</MenuItem>
        ))}
      </List>
    </Box>
  );
};

export default NavPanel;
