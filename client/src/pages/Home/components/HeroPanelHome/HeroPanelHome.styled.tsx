import { Box, Stack } from '@mui/material';
import { styled } from 'theme/utils';

export const HeroPanelHome = styled(Stack)`
  position: relative;
`;

export const Bg = styled(Box)`
  position: absolute;
  top: -116px;
  bottom: 0;
  left: 0;
  width: 100%;
  opacity: 0.8;

  &::before {
    content: '';
    display: block;
    position: absolute;
    z-index: 2;
    top: 0;
    left: 0;
    width: 100%;
    height: 232px;
    background: linear-gradient(180deg, rgba(40,52,60,1) 25%, rgba(40,52,60,0) 100%);
  }
  
  &::after {
    content: '';
    display: block;
    position: absolute;
    z-index: 2;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 464px;
    background: linear-gradient(180deg, rgba(47,64,72,0) 0%, rgba(47,64,72,1) 100%);
  }

  img {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const Content = styled(Box)`
  position: relative;
  z-index: 3;
  min-height: calc(100vh - 116px);
`;

export const Headline = styled(Box)`
  padding: 8.333333333333334vw 0;
`;

export const CTA = styled(Box)`
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 100%;
  background: ${(props) => props.theme.palette.primary.light};
`;

export const CTAContent = styled(Box)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 50%;
  padding: 40px;
`;

export const CTAVideo = styled(Box)`
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 50%;
`;