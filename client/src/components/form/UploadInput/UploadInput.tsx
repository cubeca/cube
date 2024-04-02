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
  editMode?: boolean;
  currentImage?: string;
  editType?: string;
  newImage?: string;
}

const UploadInput = ({
  text,
  onDrop,
  maxFiles,
  style,
  isUploadReady,
  isUploadComplete,
  currentImage,
  editMode,
  editType,
  newImage
}: UploadInputProps) => {
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
  if (isUploadReady && !editMode) {
    descText = t('Upload Ready');
  } else if (isUploadComplete) {
    descText = t('Upload Complete');
  } else if (editMode) {
    descText = t(`Change ${editType} Image`);
  }

  return (
    <s.UploadBox
      className={style}
      {...getRootProps()}
      isUploadReady={isUploadReady}
      isUploadComplete={isUploadComplete}
      editMode={editMode}
      currentImage={currentImage}
      newImage={newImage}
    >
      <input {...getInputProps()} />
      {editMode && currentImage !== '' && (
        <s.CurrentImageBox>
          <s.CurrentImage
            currentImage={currentImage}
            newImage={newImage}
            editMode={editMode}
          />
        </s.CurrentImageBox>
      )}
      {/* {editMode && newImage && (
        <s.NewImageBox>
          <s.NewImage newImage={newImage} />
        </s.NewImageBox>
      )} */}
      <Typography component="h6" variant="h6">
        {descText}
      </Typography>
      {isDragActive ? (
        <Typography component="p" variant="body2">
          {t('Drop the files here...')}
        </Typography>
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
