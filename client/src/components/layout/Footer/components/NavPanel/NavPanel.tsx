import LegalModalNav from '../../../../Legal/LegalModalNav';
import { useTranslation } from 'react-i18next';
import { HashLink } from 'react-router-hash-link';
import * as s from './NavPanel.styled';

import ContactUsModal from 'components/ContactUsModal';
import { useState } from 'react';

const NavPanel = () => {
  const { t } = useTranslation();
  const [isContactUsModalOpen, setIsContactUsModalOpen] = useState(false);

  const openContactUsModal = () => {
    setIsContactUsModalOpen(true);
  };

  function handleClose() {
    setIsContactUsModalOpen(false);
  }

  return (
    <>
      <ContactUsModal isOpen={isContactUsModalOpen} onClose={handleClose} />

      <s.NavList component="ul">
        <s.NavItem>
          <s.NavLink to="/">{t('Home/ Accueil')}</s.NavLink>
        </s.NavItem>

        <s.NavItem>
          <s.NavLink to="/search">{t('Search Content/ Recherche')}</s.NavLink>
        </s.NavItem>

        <s.NavItem>
          <HashLink smooth to="/#virtual-experiences">
            {t('Cube VR')}
          </HashLink>
        </s.NavItem>

        <s.NavItem>
          <s.NavLink to={''} onClick={openContactUsModal}>
            {t('Contact Us/ Contactez-Nous')}
          </s.NavLink>
        </s.NavItem>

        <s.NavItem>
          <s.NavLink to="/">{t('FAQs')}</s.NavLink>
        </s.NavItem>

        <s.NavItem>
          <s.NavLink to="/signup">{t('Become a Creator/ Devenez un Créateur')}</s.NavLink>
        </s.NavItem>

        <s.NavItem>
          <s.NavLink to="/login">{t('Login/ Connexion')}</s.NavLink>
        </s.NavItem>
        <s.NavItem>
          <LegalModalNav />
        </s.NavItem>
      </s.NavList>
    </>
  );
};

export default NavPanel;
