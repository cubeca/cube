/**
 * PlaylistItem Component
 *
 * This component represents an item within a playlist and provides a UI for interacting with it.
 * It displays the item's thumbnail, title, and type-specific icon. If the item includes sign language,
 * an additional icon is shown. The component also supports edit mode, enabling users to delete playlist items
 * with confirmation dialogs.
 *
 * Props:
 * @param {string} bgUrl - Background URL for the item's thumbnail.
 * @param {string} alt - Alt text for the thumbnail image.
 * @param {string} title - Title of the playlist item.
 * @param {string} type - Type of the item (e.g., book, audio, video, link, document).
 * @param {string} url - URL associated with the playlist item.
 * @param {boolean} [signLanguage] - Indicates if the item includes sign language.
 */

import React from 'react';
import * as s from './PlaylistPanel.styled';
import { ReactComponent as VideoIcon } from 'assets/icons/type-video-square.svg';
import { ReactComponent as AudioIcon } from '../../assets/icons/audio.svg';
import { ReactComponent as BookIcon } from '../../assets/icons/book.svg';
import { ReactComponent as SignLanguageIcon } from '../../assets/icons/sign.svg';
import { ReactComponent as LinkIcon } from '../../assets/icons/link.svg';
import { ReactComponent as DocIcon } from '../../assets/icons/doc.svg';

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
    link: LinkIcon,
    document: DocIcon
  }[type];

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = (e: any) => {
    setOpen(true);
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
              bgUrl={bgUrl
                .replace(/'/g, '%27')
                .replace(/\(/g, '%28')
                .replace(/\)/g, '%29')
                .replace(/ /g, '%20')}
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
