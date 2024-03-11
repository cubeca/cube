import { Stack } from '@mui/material';
import Dialog from 'components/Dialog';
import * as s from './EmbedPlaylistModal.styled';
import Button from 'components/Button';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';

interface EmbedPlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function generateEmbedCode(url: string) {
  return `<iframe src="${url}" style="width:100%; height:100%;" frameborder="0"></iframe>`;
}

const EmbedPlaylistModal = ({ onClose, isOpen }: EmbedPlaylistModalProps) => {
  const [copyCodeButtonText, setCopyCodeButtonText] = useState('Copy Code');

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopyCodeButtonText('Copied!');
    } catch (err) {
      setCopyCodeButtonText('Failed to copy!');
    }
  };

  const location = useLocation().pathname.replace('playlist', 'embedPlaylist');
  const hostname = window.location.hostname;
  const embedCode = generateEmbedCode('https://' + hostname + location);

  return isOpen ? (
    <Dialog
      id={'embed-playlist'}
      title={'Embed Playlist'}
      onClose={onClose}
      open={isOpen}
    >
      <s.EmbedTextField
        className="dark"
        name="embedPlaylist"
        id="embed-playlist"
        multiline
        rows={4}
        fullWidth
        value={embedCode}
        variant="outlined"
        label="Embedded Playlist"
      />

      <Stack direction="row" justifyContent="right">
        <Button onClick={copyToClipboard} color="secondary">
          {copyCodeButtonText}
        </Button>
      </Stack>
    </Dialog>
  ) : null;
};

export default EmbedPlaylistModal;
