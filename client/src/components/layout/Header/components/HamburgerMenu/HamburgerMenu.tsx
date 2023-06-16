import { Box, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ReactComponent as KebabIcon } from 'assets/icons/kebab.svg';
import { ReactComponent as CloseIcon } from 'assets/icons/dark-close.svg';
import * as s from './HamburgerMenu.styled';
import { HorizontalRule } from '@mui/icons-material';

const HamburgerMenu = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <s.Hamburger>

      <s.Kebab onClick={() => setMenuOpen(true)}>
        <KebabIcon />
      </s.Kebab>
      
      <s.Menu active={menuOpen}>
        <s.Close onClick={() => setMenuOpen(false)}>
          <CloseIcon />
        </s.Close>

        <s.MenuInner>
          <s.MenuSection>
            <ul>
              <li>Search Content</li>
              <li>Playlists</li>
              <li>VR Space</li>
              <li>Become a Creator</li>
            </ul>
          </s.MenuSection>

          <s.MenuHeader>
            <Typography component="h3" variant="h5">Glossary of icons</Typography>
          </s.MenuHeader>

          <s.MenuSection>
            <Typography component="h6" variant="h6">Accessibility</Typography>
            <ul>
              <li>Text-to-Speech</li>
              <li>Sign Language</li>
              <li>Closed Captioning</li>
            </ul>
          </s.MenuSection>
          
          <s.MenuSection>
            <Typography component="h6" variant="h6">Content Types</Typography>
            <ul>
              <li>Video</li>
              <li>Audio</li>
              <li>Activity Booklets</li>
              <li>Digital Publications</li>
              <li>Collaborations</li>
              <li>External Link</li>
            </ul>
          </s.MenuSection>
        </s.MenuInner>
      
      </s.Menu>
    </s.Hamburger>
  );
};

export default HamburgerMenu;