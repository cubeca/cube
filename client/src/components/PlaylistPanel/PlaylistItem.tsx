import React from 'react';
import * as s from './PlaylistPanel.styled';
import { ReactComponent as VideoIcon } from '../../assets/icons/type-video-square.svg';
import { ReactComponent as AudioIcon } from '../../assets/icons/audio.svg';
import { ReactComponent as BookIcon } from '../../assets/icons/book.svg';
import { ReactComponent as SignLanguageIcon } from '../../assets/icons/sign.svg';
import { ReactComponent as LinkIcon } from '../../assets/icons/link.svg';
import { DialogTitle, DialogActions } from '@mui/material';
import Button from 'components/Button';

interface PlaylistItemProps {
  bgUrl: string;
  alt: string;
  title: string;
  type: string;
  url: string;
  signLanguage?: boolean;
  editMode?: any;
  playlistId?: any;
  editingPlaylist?: any;
  setEditingPlaylist?: any;
  draggable?: boolean;
  deletePlaylistItem: (playlistId: string, contentId: string) => void;
}

const PlaylistItem: React.FC<PlaylistItemProps> = ({
  bgUrl,
  alt,
  title,
  type,
  url,
  signLanguage,
  editMode,
  playlistId,
  editingPlaylist,
  setEditingPlaylist,
  deletePlaylistItem
}) => {
  const TypeIcon = {
    book: BookIcon,
    audio: AudioIcon,
    video: VideoIcon,
    link: LinkIcon
  }[type];

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = (e: any) => {
    setOpen(true);
    // e.preventDefault();
    // e.stopPropagation();
    // e.nativeEvent.stopImmediatePropagation();
    setEditingPlaylist(playlistId);
  };
  const handleClose = () => {
    setEditingPlaylist('');
    setOpen(false);
  };

  return (
    <s.RelativeBox>
      <s.CustomDialog
        title={'Are you sure?'}
        id={'alert-dialog-title'}
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{ fontFamily: 'Inter', fontWeight: '400', maxWidth: '250px' }}
        >
          {'Are you sure you want to delete this playlist item?'}
        </DialogTitle>
        <DialogActions
          sx={{ justifyContent: 'space-evenly', alignItems: 'center' }}
        >
          <Button onClick={handleClose} color="secondary">
            No
          </Button>
          <Button
            onClick={() => deletePlaylistItem(playlistId, url)}
            color="secondary"
          >
            Yes
          </Button>
        </DialogActions>
      </s.CustomDialog>

      <s.PlaylistItemLink
        href={`/content/${url}?playlist=${playlistId}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e: { preventDefault: () => void }) => {
          if (editingPlaylist !== '' && editMode) {
            e.preventDefault();
          }
        }}
      >
        <s.PlaylistItemContainer>
          {editMode && playlistId === editingPlaylist && (
            <s.StyledCloseIcon onClick={handleClickOpen} />
          )}
          <s.PlaylistItemSubContainer>
            <s.PlaylistItemThumbnail
              bgUrl={bgUrl.replace(/ /g, '%20')}
              alt={alt}
            />
            <s.PlaylistItemTitle>{title}</s.PlaylistItemTitle>
          </s.PlaylistItemSubContainer>
          <s.PlaylistItemSubContainer>
            {signLanguage && (
              <SignLanguageIcon style={{ marginRight: '8px' }} />
            )}
            {TypeIcon && <TypeIcon />}
          </s.PlaylistItemSubContainer>
        </s.PlaylistItemContainer>
      </s.PlaylistItemLink>
    </s.RelativeBox>
  );
};

export default PlaylistItem;
