import { Box, Link, List, MenuItem } from '@mui/material';
import { useState } from 'react';
import { TFunction, useTranslation } from 'react-i18next';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import LoginDialog from 'components/dialogs/Login';

import * as s from './NavPanel.styled';

const getNavItems = (t: TFunction<'translation', undefined>) => [
  {
    text: t('Home'),
    path: '/home'
  },
  {
    text: t('About'),
    path: '/about'
  },
  {
    text: t('Become a content creator'),
    path: '/join'
  }
];

const NavPanel = () => {
  const { t } = useTranslation();
  const navItems = getNavItems(t);
  const location = useLocation();
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <>
      <Box component="nav">
        <List component="ul" sx={{ display: 'flex', alignItems: 'center' }}>
          {navItems.map((item) => (
            <s.NavItem
              key={item.path}
              selected={location.pathname.startsWith(item.path)}
            >
              <RouterLink
                to={item.path}
                style={{ textDecoration: 'none', color: '#ffffff' }}
              >
                {item.text}
              </RouterLink>
            </s.NavItem>
          ))}
          <s.NavItem>
            <s.LinkButton
              component="button"
              onClick={() => setIsLoginOpen(true)}
            >
              {t('Creator Login')}
            </s.LinkButton>
          </s.NavItem>
        </List>
      </Box>
      <LoginDialog open={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
};

export default NavPanel;
