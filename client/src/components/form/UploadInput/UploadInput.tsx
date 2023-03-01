import { Box, Typography, useTheme } from '@mui/material';
import Button from 'components/Button';
import { FC, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import * as styled from './UploadInput.styled';

interface UploadInputProps {
  text: string;
  onDrop: (files: File[]) => void;
  maxFiles?: number;
}

const UploadInput: FC<UploadInputProps> = ({ text, onDrop, maxFiles }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const handleDrop = useCallback((files: File[]) => {
    onDrop(files);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    maxFiles
  });

  return (
    <styled.UploadBox {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <Typography component="p">{t('Drop the files here...')}</Typography>
      ) : (
        <>
          <Typography component="p">{text}</Typography>
          <Button>{t('Choose a file')}</Button> {t('or drag it here')}
        </>
      )}
    </styled.UploadBox>
  );
};

export default UploadInput;
