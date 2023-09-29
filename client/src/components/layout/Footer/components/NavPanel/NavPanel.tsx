import Social from '../Social';
import LegalModal from '../../../../LegalModal/LegalModal';

import { useTranslation } from 'react-i18next';

import * as s from './NavPanel.styled';

const NavPanel = () => {
  const { t } = useTranslation();

  return (
    <s.NavList component="ul">
      <s.NavItem>
        <s.NavLink to="/about">{t('Home')}</s.NavLink>
      </s.NavItem>

      <s.NavItem>
        <s.NavLink to="/home">{t('Search Content')}</s.NavLink>
      </s.NavItem>

      <s.NavItem>
        <s.NavLink to="/">{t('VR Space')}</s.NavLink>
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
        <s.NavLink to="/Login">{t('Login')}</s.NavLink>
      </s.NavItem>
      <s.NavItem>
        <LegalModal type="navlink" />
      </s.NavItem>

      <s.NavItem>
        <Social />
      </s.NavItem>
    </s.NavList>
  );
};

export default NavPanel;
