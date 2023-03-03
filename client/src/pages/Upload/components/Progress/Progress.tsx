import { Box, Typography, useTheme } from '@mui/material';
import * as s from './Progress.styled';

const Progress = () => {
  return (
    <Box className={'upload__progress'}>
      <s.ProgressList>
        <s.ProgressItem active>
          <button>Media</button>
        </s.ProgressItem>
        <s.ProgressItem>
          <button>Details</button>
        </s.ProgressItem>
        <s.ProgressItem>
          <button>Accessibility</button>
        </s.ProgressItem>
        <s.ProgressItem>
          <button>Tags</button>
        </s.ProgressItem>
      </s.ProgressList>
    </Box>
  );
};

export default Progress;
