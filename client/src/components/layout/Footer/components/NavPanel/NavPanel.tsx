import Social from '../Social';
import { useTranslation } from 'react-i18next';
import { HashLink } from 'react-router-hash-link';
import * as s from './NavPanel.styled';

const NavPanel = () => {
  const { t } = useTranslation();
  return (

    <s.NavList component="ul">
      
      <s.NavItem>
        <s.NavLink to="/">{t('Home')}</s.NavLink>
      </s.NavItem>

      <s.NavItem>
        <s.NavLink to="/search">{t('Search Content')}</s.NavLink>
      </s.NavItem>
      
      <s.NavItem>
        <HashLink smooth to="/#virtual-experiences">
          {t('Cube VR')}
        </HashLink>
      </s.NavItem>

      <s.NavItem>
        <s.NavLink to="/">{t('Contact Us')}</s.NavLink>
      </s.NavItem>

      <s.NavItem>
        <s.NavLink to="/">{t('FAQs')}</s.NavLink>
      </s.NavItem>

      <s.NavItem>
        <s.NavLink to="/signup">{t('Become a Creator')}</s.NavLink>
      </s.NavItem>
      
      <s.NavItem>
        <s.NavLink to="/login">{t('Login')}</s.NavLink>
      </s.NavItem>

      <s.NavItem>
        <Social />
      </s.NavItem>

    </s.NavList>

  );
};

export default NavPanel;