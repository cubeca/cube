import { Button, Divider, Menu, MenuList, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import { useTranslation } from 'react-i18next';
import MenuItem from './MenuItem';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import VrpanoIcon from '@mui/icons-material/Vrpano';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import VoiceChatIcon from '@mui/icons-material/VoiceChat';
import SignLanguageIcon from '@mui/icons-material/SignLanguage';
import SubtitlesIcon from '@mui/icons-material/Subtitles';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import ArticleIcon from '@mui/icons-material/Article';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import GroupsIcon from '@mui/icons-material/Groups';
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
          icon={<SearchIcon fontSize="small" />}
          text={t('Search Content')}
        />
        <MenuItem
          onClick={() => handleMenuClick('/playlists')}
          icon={<FormatListBulletedIcon fontSize="small" />}
          text={t('Playlists')}
        />
        <MenuItem
          onClick={() => handleMenuClick('/vr')}
          icon={<VrpanoIcon fontSize="small" />}
          text={t('VR Space')}
        />
        <MenuItem
          onClick={() => handleMenuClick('/signup')}
          icon={<AddCircleIcon fontSize="small" />}
          text={t('Become a creator')}
        />
      </MenuList>
      
      <Divider />

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
        <MenuItem
          text={t('Text to Speech')}
          icon={<VoiceChatIcon fontSize="small" />}
        />
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
        onClick={() => {}}
      />
      <MenuItem
        text={t('Audio')}
        icon={<VolumeUpIcon fontSize="small" />}
        onClick={() => {}}
      />
      <MenuItem
        text={t('Activity Books')}
        icon={<ArticleIcon fontSize="small" />}
        onClick={() => {}}
      />
      <MenuItem
        text={t('Digital Publications')}
        icon={<MenuBookIcon fontSize="small" />}
        onClick={() => {}}
      />
      <MenuItem
        text={t('Collaborators')}
        icon={<GroupsIcon fontSize="small" />}
        onClick={() => {}}
      />
    </s.MainMenu>
  );
};

export default MainMenu;
