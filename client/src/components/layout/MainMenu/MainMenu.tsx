import { Button, Divider, MenuList, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { useTranslation } from 'react-i18next';
import { useEffect, useRef } from 'react';
import MenuItem from './MenuItem';
import SignLanguageIcon from '@mui/icons-material/SignLanguage';
import SubtitlesIcon from '@mui/icons-material/Subtitles';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import BookIcon from '@mui/icons-material/MenuBook';
import WorddocIcon from '@mui/icons-material/Article';
import LinkIcon from '@mui/icons-material/Link';
import CloseIcon from '@mui/icons-material/Close';
import * as s from './MainMenu.styled';

interface MainMenuProps {
  open: boolean;
  anchorEl: null | HTMLElement;
  onClose: () => void;
  id: string;
  isLoggedIn: boolean;
}

const MainMenu = ({
  open,
  anchorEl,
  onClose,
  id,
  isLoggedIn
}: MainMenuProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const handleMenuClick = (path: string) => {
    navigate(path);
    onClose();
  };

  const previousFocusRef = useRef<HTMLElement | null>(null);
  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleKeyDown = (event: React.KeyboardEvent, path: string) => {
    if (event.key === 'Enter') {
      handleNavigation(path);
    }
  };
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (open) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      const dialogElement = document.getElementById('main-menu-is-open');
      dialogElement?.focus();
      document.addEventListener('keydown', handleKeyDown);
    } else {
      previousFocusRef.current?.focus();
      document.removeEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  return (
    <s.ProfileMenu
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      id={id}
      aria-orientation="vertical"
      MenuListProps={{
        'aria-labelledby': id
      }}
      role="menu"
      ref={previousFocusRef}
      aria-label="button to open main menu"
    >
      <s.CloseButton 
        onClick={onClose}
        aria-label={t('Close Menu')}
      >
        <CloseIcon />
      </s.CloseButton>

      <MenuItem
        onClick={() => handleMenuClick('/search')}
        text={t('Search')}
        // aria-label="button to go to search page"
      />

      <s.MenuHashItem
        role="menuitem"
        tabIndex={0}
        onClick={() => {
          onClose();
        }}
        onKeyDown={(event: { key: string; preventDefault: () => void }) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            const linkElement = document.getElementById('cube-vr-link');
            if (linkElement) {
              linkElement.click();
              onClose();
            }
          }
        }}
      >
        <HashLink
          smooth
          to="/#virtual-experiences"
          id="cube-vr-link"
          tabIndex={-1}
        >
          {t('Cube VR')}
        </HashLink>
      </s.MenuHashItem>

      <s.MenuHashItem
        role="menuitem"
        tabIndex={0}
        onClick={() => {
          onClose();
        }}
        onKeyDown={(event: { key: string; preventDefault: () => void }) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            const linkElement = document.getElementById(
              'translate-content-link'
            );
            if (linkElement) {
              linkElement.click();
              onClose();
            }
          }
        }}
      >
        <HashLink
          smooth
          to="/#language-translation"
          id="translate-content-link"
          tabIndex={-1}
        >
          {t('Translate Content & Buttons')}
        </HashLink>
      </s.MenuHashItem>

      <MenuItem
        onClick={() => handleMenuClick('/signup')}
        text={t('Become a Creator')}
        tabIndex={0}
        // aria-label="button to go to signup page"
      />
      <MenuItem
        onClick={() => handleMenuClick('/signup')}
        text={t('Devenez un Créateur')}
        // aria-label="bouton pour accéder à la page d'inscription"
      />

      <MenuItem
        onClick={() => handleMenuClick('/search')}
        text={t('Rechercher')}
        // aria-label="bouton pour aller à la page de recherche"
      />

      <s.MenuHashItem
        role="menuitem"
        tabIndex={0}
        onClick={() => {
          onClose();
        }}
        onKeyDown={(event: { key: string; preventDefault: () => void }) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            const linkElement = document.getElementById(
              'translate-content-link'
            );
            if (linkElement) {
              linkElement.click();
              onClose();
            }
          }
        }}
      >
        <HashLink
          smooth
          to="/#language-translation"
          id="translate-content-link"
          tabIndex={-1}
        >
          {t('Traduire Contenu & Boutons')}
        </HashLink>
      </s.MenuHashItem>

      <Divider />

      <s.Glossary tabIndex={0}>
        <Typography
          component="h3"
          px="16px"
          pt="20px"
          fontWeight="bold"
          m={0}
          mb={1}
        >
          Glossary of Icons
        </Typography>

        <Typography component="h4">Accessibility</Typography>

        <MenuItem
          text={t('Sign Language')}
          icon={<SignLanguageIcon fontSize="small" />}
        />
        <MenuItem
          text={t('Subtitles')}
          icon={<SubtitlesIcon fontSize="small" />}
        />

        <Typography component="h4">Content Types</Typography>

        <MenuItem text={t('Video')} icon={<PlayArrowIcon fontSize="small" />} />
        <MenuItem text={t('Audio')} icon={<VolumeUpIcon fontSize="small" />} />
        <MenuItem text={t('PDF')} icon={<BookIcon fontSize="small" />} />
        <MenuItem
          text={t('Word Doc')}
          icon={<WorddocIcon fontSize="small" />}
        />
        <MenuItem text={t('Link')} icon={<LinkIcon fontSize="small" />} />
        <Typography
          component="h3"
          px="16px"
          pt="20px"
          fontWeight="bold"
          m={0}
          mb={1}
        >
          |FR| Glossaire des Icônes
        </Typography>

        <Typography component="h4">Accessibilité</Typography>

        <MenuList>
          <MenuItem
            text={t('Langage des Signes')}
            icon={<SignLanguageIcon fontSize="small" />}
          />
          <MenuItem
            text={t('Les Sous-Titres')}
            icon={<SubtitlesIcon fontSize="small" />}
          />
        </MenuList>
        <Typography component="h4">Types de Contenu</Typography>

        <MenuItem text={t('Vidéo')} icon={<PlayArrowIcon fontSize="small" />} />
        <MenuItem
          text={t('L`Audio')}
          icon={<VolumeUpIcon fontSize="small" />}
        />
        <MenuItem text={t('PDF')} icon={<BookIcon fontSize="small" />} />
        <MenuItem
          text={t('Doc Word')}
          icon={<WorddocIcon fontSize="small" />}
        />
        <MenuItem text={t('Lien')} icon={<LinkIcon fontSize="small" />} />
      </s.Glossary>
    </s.ProfileMenu>
  );
};

export default MainMenu;
