/**
 * `UploadProgress` is the final step of the upload flow and displays the upload progress of a file. It listens to an event emitter
 * for upload progress updates and updates its state accordingly. The progress is displayed both as a percentage in text and visually
 * through the animation's progress.
 */

import { Typography } from '@mui/material';
import { progressEmitter } from 'api/upload';
import * as s from './UploadProgress.styled';
import LoadingCubes from 'assets/animations/loading-cubes.json';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Lottie from 'lottie-react';

const UploadProgress = ({ editMode }: any) => {
  const { t } = useTranslation();
  const [progress, setProgress] = useState('');
  const [progressInt, setProgressInt] = useState(0);

  useEffect(() => {
    const progressHandler = ({
      bytesUploaded,
      bytesTotal
    }: {
      bytesUploaded: number;
      bytesTotal: number;
    }) => {
      const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
      const percentageInt = parseInt(percentage);
      setProgressInt(percentageInt);
      setProgress(percentage);
    };

    progressEmitter.on('progress', progressHandler);

    return () => {
      progressEmitter.off('progress', progressHandler);
    };
  }, []);

  return (
    <s.ModalContainer>
      <Lottie
        className="loading-cubes"
        animationData={LoadingCubes}
        loop={true}
        style={{ width: '170px', height: '170px' }}
      />
      <s.ModalTitle variant="h1">
        {editMode ? t('Applying changes...') : t('Uploading')}
      </s.ModalTitle>
      {!editMode && (
        <Typography variant="body2" sx={{ paddingBottom: '24px' }}>
          {progress !== '' ? `${progress}% complete.` : ''}
        </Typography>
      )}
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
