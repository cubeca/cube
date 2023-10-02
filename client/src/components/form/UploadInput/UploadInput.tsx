import { Box, Typography, useTheme } from '@mui/material';
import Button from 'components/Button';
import { FC, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import * as s from './UploadInput.styled';

interface UploadInputProps {
  text: string;
  onDrop: (files: File[]) => void;
  maxFiles?: number;
  style?: string;
  isUploadReady?: boolean;
  isUploadComplete?: boolean;
}

const UploadInput = ({ text, onDrop, maxFiles, style, isUploadReady, isUploadComplete }: UploadInputProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const handleDrop = useCallback((files: File[]) => {
    onDrop(files);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    maxFiles
  });

  let descText = text;

  if (isUploadReady) {
    descText = t('Upload Ready');
  } else if (isUploadComplete) {
    descText = t('Upload Complete');
  }

  return (
    <s.UploadBox className={style} {...getRootProps()} isUploadReady={isUploadReady} isUploadComplete={isUploadComplete}>
      <input {...getInputProps()} />
      
          <Typography component="h6" variant="h6">{descText}</Typography>
          
          {isDragActive ? (
            <Typography component="p" variant="body2">{t('Drop the files here...')}</Typography>
          ) : (
            <Typography component="p" variant="body2">
              <s.UploadButton>{t('Choose a file')}</s.UploadButton>{' '}
              {t('or drag it here')}
            </Typography>
          )}
      
    </s.UploadBox>
  );
};

export default UploadInput;
