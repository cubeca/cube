import { Box, Link, List, MenuItem } from '@mui/material';
import { useState } from 'react';
import { TFunction, useTranslation } from 'react-i18next';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import LoginDialog from 'components/dialogs/Login';

import * as s from './NavPanel.styled';

const getNavItems = (t: TFunction<'translation', undefined>) => [
  {
    text: t('Search Content'),
    path: '/home'
  },
  {
    text: t('VR Space'),
    path: '/about'
  },
  {
    text: t('Become a Creator'),
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
      <Box component="nav" marginLeft="2rem">
        <List component="ul" sx={{ display: 'flex', alignItems: 'left'}}>
          {navItems.map((item) => (
            <s.NavItem
              key={item.path}
              selected={location.pathname.startsWith(item.path)}
             
            >
              <RouterLink
                to={item.path}
                style={{ textDecoration: 'none', color: '#ffffff'}}
              >
                {item.text}
              </RouterLink>
            </s.NavItem>
          ))}
          <s.NavItem
           sx={{ ml:'5rem'}}
          >
            <s.LinkButton
            sx={{border:'0.8px solid #7fd6c1', borderRadius: '5px', texAlign: 'center', p: '10px'}} 
              component="button"
              onClick={() => setIsLoginOpen(true)}
            >
              {t('Login')}
            </s.LinkButton>
          </s.NavItem>
        </List>
      </Box>
      <LoginDialog open={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
};

export default NavPanel;
