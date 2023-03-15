import { TFunction, useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import * as s from './PrimaryNav.styled';

const getNavItems = (t: TFunction<'translation', undefined>) => [
  {
    text: t('Search Content'),
    path: '/home'
  },
  {
    text: t('Cube VR'),
    path: '/about#vr'
  },
  {
    text: t('Become a Creator'),
    path: '/signup'
  }
];

const PrimaryNav = () => {
  const { t } = useTranslation();
  const navItems = getNavItems(t);
  const location = useLocation();

  return (
    <>
      <s.PrimaryNav component="nav">
        <s.NavList component="ul">
          {navItems.map((item) => (
            <s.NavItem
              key={item.path}
              selected={location.pathname.startsWith(item.path)}
            >
              <s.LinkButton to={item.path}>{item.text}</s.LinkButton>
            </s.NavItem>
          ))}
        </s.NavList>
      </s.PrimaryNav>
    </>
  );
};

export default PrimaryNav;
