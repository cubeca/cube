import { Stack, TextField } from '@mui/material';
import Dialog from 'components/Dialog';
import * as s from './EmbedModal.styled';
import Button from 'components/Button';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';

interface EmbedModalProps {
  isOpen: boolean;
  onClose: () => void;
  embedContentType: string;
  embedContentWhitelist: string[];
}

function generateEmbedCode(
  type: string,
  embedContentWhitelist: string[],
  url: string
) {
  let embedCode = '';
  const currentDomain = window.location.hostname;

  function isDomainAllowed(currentDomain: string) {
    return embedContentWhitelist.includes(currentDomain);
  }

  if (!isDomainAllowed(currentDomain)) {
    return 'Domain not allowed to generate embed code.';
  }

  switch (type) {
    case 'audio':
    case 'pdf':
    case 'video':
    case 'link':
      embedCode = `<iframe src="${url}" style="width:100%; height:100%;" frameborder="0" referrerpolicy="strict-origin"></iframe>`;
      break;
    default:
      embedCode = 'Invalid type specified';
  }

  return embedCode;
}

const EmbedModal = ({
  onClose,
  isOpen,
  embedContentType,
  embedContentWhitelist
}: EmbedModalProps) => {
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
    embedContentWhitelist,
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
