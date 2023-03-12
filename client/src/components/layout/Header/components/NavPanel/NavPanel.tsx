import { Box, List } from '@mui/material';
import { TFunction, useTranslation } from 'react-i18next';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';

import * as s from './NavPanel.styled';

const getNavItems = (t: TFunction<'translation', undefined>) => [
  {
    text: t('Search'),
    path: '/home'
  },
  {
    text: t('Home'),
    path: '/about'
  },
  {
    text: t('VR'),
    path: '/about#vr'
  },
  {
    text: t('Become a Creator'),
    path: '/signup'
  }
];

const NavPanel = () => {
  const { t } = useTranslation();
  const navItems = getNavItems(t);
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <>
      <Box component="nav" marginLeft="2rem">
        <List component="ul" sx={{ display: 'flex', alignItems: 'left' }}>
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
          <s.NavItem sx={{ ml: '5rem' }}>
            <s.LinkButton
              sx={{
                border: '0.8px solid #7fd6c1',
                borderRadius: '5px',
                texAlign: 'center',
                p: '10px'
              }}
              component="button"
              onClick={() => navigate('/login')}
            >
              {t('Login')}
            </s.LinkButton>
          </s.NavItem>
        </List>
      </Box>
    </>
  );
};

export default NavPanel;
