import { Box, Stack } from '@mui/material';
import { styled } from 'theme/utils';

export const VideoWrapper = styled(Box)`
  position: relative;
  width: 100%;
  padding-top: 56.25%;

  & > div,
  video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100% !important;
  }
`;