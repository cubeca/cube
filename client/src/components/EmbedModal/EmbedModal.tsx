import { Stack, TextField } from '@mui/material';
import Dialog from 'components/Dialog';
import * as s from './EmbedModal.styled';
import Button from 'components/Button';
import { useState } from 'react';

interface EmbedModalProps {
  isOpen: boolean;
  onClose: () => void;
  embedContent: string;
}

const EmbedModal = ({ onClose, isOpen, embedContent }: EmbedModalProps) => {
  const [copyCodeButtonText, setCopyCodeButtonText] = useState('Copy Code');

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(embedContent);
      setCopyCodeButtonText('Copied!');
    } catch (err) {
      setCopyCodeButtonText('Failed to copy!');
    }
  };

  return isOpen ? (
    <Dialog
      id={'embed-content'}
      title={'Embed Content'}
      onClose={onClose}
      open={isOpen}
    >
      <TextField
        id="embed-content"
        label="Embed Content"
        value={embedContent}
        multiline
        rows={4}
      />

      <Stack direction="row" justifyContent="right">
        <Button onClick={copyToClipboard} color="secondary">
          {copyCodeButtonText}
        </Button>
      </Stack>
    </Dialog>
  ) : null;
};

export default EmbedModal;
