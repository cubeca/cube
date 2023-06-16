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
}

const UploadInput: FC<UploadInputProps> = ({ text, onDrop, maxFiles, style }) => {
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
    <s.UploadBox className={style} {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <Typography component="p">{t('Drop the files here...')}</Typography>
      ) : (
        <>
          <Typography component="h6" variant="h6">
            {text}
          </Typography>
          <Typography component="p" variant="body2">
            <s.UploadButton>{t('Choose a file')}</s.UploadButton>{' '}
            {t('or drag it here')}
          </Typography>
        </>
      )}
    </s.UploadBox>
  );
};

export default UploadInput;
