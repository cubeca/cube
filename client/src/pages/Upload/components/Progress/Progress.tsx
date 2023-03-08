import { Box, Typography, useTheme } from '@mui/material';

const Progress = () => {
  return (
    <Box className={'upload__progress'}>
      <ul>
        <li>
          <button>Media</button>
          <button>Details</button>
          <button>Accessibility</button>
          <button>Tags</button>
        </li>
      </ul>
    </Box>
  );
};

export default Progress;
