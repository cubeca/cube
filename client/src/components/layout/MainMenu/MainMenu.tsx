import { Button, Divider, MenuList, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { useTranslation } from 'react-i18next';
import MenuItem from './MenuItem';
import SignLanguageIcon from '@mui/icons-material/SignLanguage';
import SubtitlesIcon from '@mui/icons-material/Subtitles';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import MenuBookIcon from '@mui/icons-material/MenuBook';
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

  return (
    <s.MainMenu
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      id={id}
      MenuListProps={{
        'aria-labelledby': id
      }}
      >

      <Button className='close-button' onClick={onClose}>
        <CloseIcon />
      </Button>

      <MenuList sx={{ padding: '4px 4px' }}>
        <MenuItem
          onClick={() => handleMenuClick('/search')}
          text={t('Search Content')}
        />
        <s.MenuHashItem>
          <HashLink smooth to="/#virtual-experiences">
            {t('Cube VR')}
          </HashLink>
        </s.MenuHashItem>
        <MenuItem
          onClick={() => handleMenuClick('/signup')}
          text={t('Become a creator')}
        />
      </MenuList>
      
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
        
        <Typography component="h4">
          Accessibility
        </Typography>

        <MenuList>
          {/* <MenuItem
            text={t('Text to Speech')}
            icon={<VoiceChatIcon fontSize="small" />}
          /> */}
          <MenuItem
            text={t('Sign Language')}
            icon={<SignLanguageIcon fontSize="small" />}
          />
          <MenuItem
            text={t('Subtitles')}
            icon={<SubtitlesIcon fontSize="small" />}
          />
        </MenuList>

        <Typography component="h4">
          Content Types
        </Typography>
        
        <MenuItem
          text={t('Video')}
          icon={<PlayArrowIcon fontSize="small" />}
        />
        <MenuItem
          text={t('Audio')}
          icon={<VolumeUpIcon fontSize="small" />}
        />
        <MenuItem
          text={t('PDF')}
          icon={<MenuBookIcon fontSize="small" />}
        />
        <MenuItem
          text={t('Link')}
          icon={<LinkIcon fontSize="small" />}
        />
      </s.Glossary>
      
    </s.MainMenu>
  );
};

export default MainMenu;
