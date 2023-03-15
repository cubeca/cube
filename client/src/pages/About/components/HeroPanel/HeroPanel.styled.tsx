import { styled } from 'theme/utils';
import HeroBgImg from 'assets/images/about-hero-bg.jpg';
import Grid from '@mui/system/Unstable_Grid';
import { Box, Typography } from '@mui/material';

export const Hero = styled(Box)`
  position: relative;
  overflow-y: visible;
  z-index: 1;
  margin-top: -120px;
`;

export const HeroBg = styled(Box)`
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  width: 100vw;
  height: 65.625vw;
  max-width: ${({ theme }) => theme.breakpoints.values.xl}px;
  min-height: 720px;
  background: transparent no-repeat url('${HeroBgImg}') top left/cover;

  ${(props) => props.theme.breakpoints.up('xl')} {
    background-size: contain;
    min-height: 960px;
  }
`;

export const HeroContent = styled(Grid)`
  position: relative;
  z-index: 2;
  padding: 120px 0;
`;

export const HeroContentMain = styled(Box)`
  height: 480px;
  padding-top: 120px;

  ${(props) => props.theme.breakpoints.up('lg')} {
    padding-top: 180px;
  }

  ${(props) => props.theme.breakpoints.up('xl')} {
    padding-top: 240px;
  }

  h1 {
    margin: 24px 0 12px;
    line-height: 1;
  }

  p {
    margin: 0 0 12px;
    font-weight: 500;
    color: ${({ theme }) => theme.palette.primary.main};
  }

  .play-button {
  }
`;

export const HeroContentCTA = styled(Box)`
  height: 480px;
  max-width: 480px;
  margin: 0 0 0 auto;

  ${(props) => props.theme.breakpoints.up('lg')} {
    height: 600px;
    max-width: 600px;
  }

  ${(props) => props.theme.breakpoints.up('xl')} {
    height: 720px;
    max-width: 720px;
  }
`;

export const HeroContentCTAPlay = styled(Box)`
  width: 100%;
  height: 480px;
  padding: 120px 120px 40px 40px;
  color: ${({ theme }) => theme.palette.background.default};

  h1 {
    margin: 24px 0 12px;
    line-height: 1;
    color: ${({ theme }) => theme.palette.background.default};
  }

  p {
    margin: 0 0 40px;
    font-weight: 500;
  }

  .play-button {
    display: block;
    width: 54px;
    height: 62px;
  }
`;
