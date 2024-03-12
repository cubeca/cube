import { Typography } from '@mui/material';
import { progressEmitter } from 'api/upload';
import * as s from './UploadProgress.styled';
import LoadingCubes from 'assets/animations/loading-cubes.json';
import { useState } from 'react';

import { useTranslation } from 'react-i18next';
import Lottie from 'lottie-react';
const UploadProgress = () => {
  const { t } = useTranslation();
  const [progress, setProgress] = useState('');
  const [progressInt, setProgressInt] = useState(0);
  progressEmitter.on('progress', ({ bytesUploaded, bytesTotal }) => {
    // Update UI with progress information
    const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
    const percentageInt = parseInt(percentage);
    setProgressInt(percentageInt);
    setProgress(percentage);
  });
  return (
    <s.ModalContainer>
      <Lottie
        className="loading-cubes"
        animationData={LoadingCubes}
        loop={true}
        style={{ width: '170px', height: '170px' }}
      />
      <s.ModalTitle variant="h1">{t('Uploading')}</s.ModalTitle>
      <Typography variant="body2" sx={{ paddingBottom: '24px' }}>
        {progress !== '' ? `${progress}% complete.` : ''}
      </Typography>
      <Typography variant="body2" sx={{ paddingBottom: '24px' }}>
        Don&apos;t close your browser window.
      </Typography>
      <s.ProgressBarContainer>
        <s.ProgressBar progress={progressInt} />
      </s.ProgressBarContainer>
    </s.ModalContainer>
  );
};

export default UploadProgress;
