/**
 * `EmbedModal` renders a modal dialog using the `Dialog` component.
 * It is designed to generate and display an embed code for different types of content (audio, pdf, video, link) based on the content type and a URL.
 * @param {string} embedContentType The type of content to generate the embed code for (e.g., audio, pdf, video, link).
 */

import { Stack } from '@mui/material';
import Dialog from 'components/Dialog';
import * as s from './EmbedModal.styled';
import Button from 'components/Button';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';

interface EmbedModalProps {
  isOpen: boolean;
  onClose: () => void;
  embedContentType: string;
}

function generateEmbedCode(type: string, url: string) {
  let embedCode = '';

  switch (type) {
    case 'audio':
      embedCode = `<iframe src="${url}" style="width:100%; height:100%;" frameborder="0"></iframe>`;
      break;
    case 'pdf':
      embedCode = `<iframe src="${url}" style="width:100%; height:100%;" frameborder="0"></iframe>`;
      break;
    case 'video':
      embedCode = `<iframe src="${url}" style="width:100%; height:100%;" frameborder="0"></iframe>`;
      break;
    case 'link':
      embedCode = `<iframe src="${url}" style="width:100%; height:100%;" frameborder="0"></iframe>`;
      break;
    case 'playlist':
      embedCode = `<iframe src="${url}" style="width:100%; height:100%;" frameborder="0"></iframe>`;
      break;
    default:
      embedCode = 'Invalid type specified';
  }

  return embedCode;
}

const EmbedModal = ({ onClose, isOpen, embedContentType }: EmbedModalProps) => {
  const [copyCodeButtonText, setCopyCodeButtonText] = useState('Copy Code');

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopyCodeButtonText('Copied!');
    } catch (err) {
      setCopyCodeButtonText('Failed to copy!');
    }
  };

  const location = useLocation().pathname.replace('content', 'embed');
  const hostname = window.location.hostname;
  const embedCode = generateEmbedCode(
    embedContentType,
    'https://' + hostname + location
  );

  return isOpen ? (
    <Dialog
      id={'embed-content'}
      title={'Embed Content'}
      onClose={onClose}
      open={isOpen}
    >
      <s.EmbedTextField
        className="dark"
        name="embedContent"
        id="embed-content"
        multiline
        rows={4}
        fullWidth
        value={embedCode}
        variant="outlined"
        label="Embedded Content"
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
