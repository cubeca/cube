import { Box, Typography } from '@mui/material';
import Button from 'components/Button';
import { FC, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';

interface UploadInputProps {
  text: string;
  onDrop: (files: File[]) => void;
  maxFiles?: number;
}

const UploadInput: FC<UploadInputProps> = ({ text, onDrop, maxFiles }) => {
  const { t } = useTranslation();
  const handleDrop = useCallback((files: File[]) => {
    onDrop(files);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    maxFiles
  });

  return (
    <Box
      {...getRootProps()}
      bgcolor="#C4C4C4"
      color="#000000"
      borderRadius="5px"
      p="2rem"
      textAlign="center"
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <Typography component="p">{t('Drop the files here...')}</Typography>
      ) : (
        <>
          <Typography component="p" pb="1rem">
            {text}
            <br />
            {t('or')}
          </Typography>
          <Button>{t('Choose file')}</Button>
        </>
      )}
    </Box>
  );
};

export default UploadInput;
