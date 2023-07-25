import { Box, Stack } from '@mui/material';
import { styled } from 'theme/utils';

export const HeroPanelHome = styled(Stack)`
  position: relative;
  background-color: rgba(47,64,72,1);
`;

export const Bg = styled(Box)`
  position: absolute;
  top: -78px;
  bottom: 360px;
  left: 0;
  width: 100%;
  
  ${(props) => props.theme.breakpoints.up('md')} {
    top: -116px;
  }

  &::before {
    content: '';
    display: block;
    position: absolute;
    z-index: 2;
    top: 0;
    left: 0;
    width: 100%;
    height: 232px;
    background: linear-gradient(180deg, rgba(40,52,60,1) 12.5%, rgba(40,52,60,0) 100%);
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
    opacity: 0.8;
  }
`;

export const Content = styled(Box)`
  position: relative;
  z-index: 3;
  min-height: calc(100vh - 116px);
`;

export const Headline = styled(Box)`
  padding: 8.333333333333334vw 0;

  h1 {
    font-weight: 400;
    margin: 0;

    .category {
      color: ${(props) => props.theme.palette.primary.main};
      font-weight: 600;
    }
  }

  h2 {
    margin: 16px 0;
  }
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
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;

  h2 {
    font-weight: 600;
    margin-bottom: 16px;
  }

  p {}

  > *:last-child {
    margin-bottom: 0;
  }
`;

export const CTAVideo = styled(Box)`
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 50%;

  .play-button {
    position: absolute;
    left: 40px;
    bottom: 60px;

    svg {
      path {
        fill: ${(props) => props.theme.palette.primary.light};
      }
    }
  }
`;