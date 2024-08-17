import { useTranslation } from 'react-i18next';
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
            aria-label="Got to the Search page"
          >
            <s.LinkButton to={'/search'}>{t('Search Content')}</s.LinkButton>
          </s.NavItem>

          <s.NavItem aria-label="Go to VR offerings">
            <HashLink smooth to="/#virtual-experiences">
              {t('Cube VR')}
            </HashLink>
          </s.NavItem>

          <s.NavItem
            key={'/signup'}
            selected={location.pathname.startsWith('/signup')}
            aria-label="Button to Sign Up for a Creator Account"
          >
            <s.LinkButton to={'/signup'}>{t('Become a Creator')}</s.LinkButton>
          </s.NavItem>
        </s.NavList>
      </s.PrimaryNav>
    </>
  );
};

export default PrimaryNav;
