import { TFunction, useTranslation } from 'react-i18next';
import { HashLink } from 'react-router-hash-link';
import { useLocation } from 'react-router-dom';
import * as s from './PrimaryNav.styled';

const PrimaryNav = () => {
  const { t } = useTranslation();
  const location = useLocation();

  return (
    <>
      <s.PrimaryNav component="nav">
        <s.NavList component="ul">

          <s.NavItem
            key={'/search'}
            selected={location.pathname.startsWith('/search')}
          >
            <s.LinkButton to={'/search'}>{t('Search Content')}</s.LinkButton>
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
            <s.LinkButton to={'/signup'}>{t('Become a Creator')}</s.LinkButton>
          </s.NavItem>
          
        </s.NavList>
      </s.PrimaryNav>
    </>
  );
};

export default PrimaryNav;