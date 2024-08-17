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
    <s.MainMenu
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      id={'main-menu-is-open'}
      aria-orientation="vertical"
      MenuListProps={{
        'aria-labelledby': id
      }}
    >
      <Button className="close-button" onClick={onClose} tabIndex={0}>
        <CloseIcon />
      </Button>

      <MenuList sx={{ padding: '4px 4px' }}>
        <MenuItem
          onClick={() => handleMenuClick('/search')}
          text={t('Search')}
        />
        <s.MenuHashItem tabIndex={-1}>
          <HashLink smooth to="/#virtual-experiences">
            {t('Cube VR')}
          </HashLink>
        </s.MenuHashItem>
        <s.MenuHashItem tabIndex={-1}>
          <HashLink smooth to="/#language-translation">
            {t('Translate Content & Buttons')}
          </HashLink>
        </s.MenuHashItem>
        <MenuItem
          onClick={() => handleMenuClick('/signup')}
          text={t('Become a Creator')}
        />
        <MenuItem
          onClick={() => handleMenuClick('/signup')}
          text={t('Devenez un Créateur')}
        />
      </MenuList>
      <MenuItem
        onClick={() => handleMenuClick('/search')}
        text={t('Rechercher')}
      />
      <MenuItem
        onClick={() => handleMenuClick('/home')}
        text={t('Traduire Contenu & Boutons')}
      />

      <Divider />

      <s.Glossary>
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

        <MenuList>
          <MenuItem
            text={t('Sign Language')}
            icon={<SignLanguageIcon fontSize="small" />}
          />
          <MenuItem
            text={t('Subtitles')}
            icon={<SubtitlesIcon fontSize="small" />}
          />
        </MenuList>

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
    </s.MainMenu>
  );
};

export default MainMenu;
