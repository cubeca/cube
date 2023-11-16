import { Box } from '@mui/material';
import { styled } from 'theme/utils';

export const VideoWrapper = styled(Box)`
  & > div,
  video,
  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100% !important;
  }
`;

export const AudioWrapper = styled(Box)`
  position: relative;
  width: 100%;
  padding-top: 46.25%;

  & video::-webkit-media-text-track-display {
    overflow: visible !important;
    -webkit-box-sizing: border-box;
    background: black;
    padding: 8px;
    borderradius: 16px;
  }

  & video::-webkit-media-text-track-container {
    overflow: visible !important;
    -webkit-transform: translateY(-10%) !important;
    transform: translateY(-10%) !important;
    position: relative;
  }

  & > div,
  video,
  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100% !important;
  }
`;

export const LinkWrapper = styled(Box)`
  position: absolute;
  width: 100%;
`;

export const ContentWrapper = styled(Box)``;
