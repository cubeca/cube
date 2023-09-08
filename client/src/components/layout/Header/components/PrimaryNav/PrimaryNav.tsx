import { TFunction, useTranslation } from 'react-i18next';
import { HashLink } from 'react-router-hash-link';
import { useLocation } from 'react-router-dom';

import * as s from './PrimaryNav.styled';

const getNavItems = (t: TFunction<'translation', undefined>) => [
  {
    text: t('Search Content'),
    path: '/search'
  },
  {
    text: t('Cube VR'),
    path: '/#virtual-experiences'
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

          <s.NavItem
            key={'/search'}
            selected={location.pathname.startsWith('/search')}
          >
            <s.LinkButton to={'/search'}>{'Search Content'}</s.LinkButton>
          </s.NavItem>

          <s.NavItem>
            <HashLink smooth to="/#virtual-experiences">
              {t('Cube VR')}
            </HashLink>
          </s.NavItem>
          
          <s.NavItem
            key={'/signup'}
            selected={location.pathname.startsWith('/signup')}
          >
            <s.LinkButton to={'/signup'}>{'Become a Creator'}</s.LinkButton>
          </s.NavItem>
          
        </s.NavList>
      </s.PrimaryNav>
    </>
  );
};

export default PrimaryNav;
