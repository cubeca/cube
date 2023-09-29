import { styled } from 'theme/utils';
import BgImg from 'assets/images/about-hero-bg.jpg';
import Grid from '@mui/system/Unstable_Grid';
import { Box, Typography } from '@mui/material';

export const Hero = styled(Box)`
  position: relative;
  overflow-y: visible;
  z-index: 1;
  margin-top: -78px;
  
  ${(props) => props.theme.breakpoints.up('md')} {
    margin-top: -116px;
  }
`;

export const Bg = styled(Box)`
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  width: 100vw;
  height: 65.625vw;
  max-width: ${({ theme }) => theme.breakpoints.values.xl}px;
  min-height: 720px;
  background: transparent no-repeat url('${BgImg}') top center/cover;
  
  ${(props) => props.theme.breakpoints.up('xl')} {
    background-size: contain;
    min-height: 960px;
  }
`;

export const Content = styled(Grid)`
  position: relative;
  z-index: 2;
  padding: 120px 0 1px 0;
  
  ${(props) => props.theme.breakpoints.up('md')} {
    padding-bottom: 120px;
  }
`;

export const ContentMain = styled(Box)`
  height: 600px;
  padding-top: 120px;
  padding-bottom: 120px;
  text-align: center;

  ${(props) => props.theme.breakpoints.up('md')} {
    text-align: left;
  }

  ${(props) => props.theme.breakpoints.up('lg')} {
    padding-top: 180px;
  }

  ${(props) => props.theme.breakpoints.up('xl')} {
    padding-top: 240px;
  }

  h1 {
    margin: 24px 0 12px;
    line-height: 1;

    ${(props) => props.theme.breakpoints.down('sm')} {
      font-size: 60px;
    }
  }

  p {
    margin: 0 0 24px;
    font-weight: 500;
    color: ${({ theme }) => theme.palette.primary.main};
  }

  .play-button {
  }
`;

export const ContentCTA = styled(Box)`

  ${(props) => props.theme.breakpoints.up('md')} {
    height: 480px;
    max-width: 480px;
    margin: 0 0 0 auto;
  }
  
  ${(props) => props.theme.breakpoints.up('lg')} {
    height: 600px;
    max-width: 600px;
  }

  ${(props) => props.theme.breakpoints.up('xl')} {
    height: 720px;
    max-width: 720px;
  }

  .react-player__preview {
    ${(props) => props.theme.breakpoints.down('sm')} {
      background-color: ${({ theme }) => theme.palette.primary.main} !important;
      background-position: center right !important;
      background-size: contain !important;
      background-repeat: no-repeat !important;
    }
  }
`;

export const ContentCTAPlay = styled(Box)`
  width: 100%;
  height: auto;
  padding: 24px 128px 24px 8.333333333333333%;
  color: ${({ theme }) => theme.palette.background.default};

  ${(props) => props.theme.breakpoints.down('sm')} {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
  }

  ${(props) => props.theme.breakpoints.up('md')} {
    height: 480px;
    padding: 120px 120px 40px 40px;
  }

  h1 {
    margin: 24px 0 12px;
    line-height: 1;
    color: ${({ theme }) => theme.palette.background.default};
    display: none;

    ${(props) => props.theme.breakpoints.up('md')} {
      display: block;
    }

  }

  p {
    margin: 0 0 40px;
    font-weight: 900;

    ${(props) => props.theme.breakpoints.down('sm')} {
      order: 2;
      margin-bottom: 0;
    }
    
    ${(props) => props.theme.breakpoints.up('md')} {
      font-weight: 500;
    }
  }

  .play-button {
    display: block;
    width: 38px;
    height: 44px;

    ${(props) => props.theme.breakpoints.down('sm')} {
      margin-right: 24px;
    }

    ${(props) => props.theme.breakpoints.up('md')} {
      width: 54px;
      height: 62px;
    }
  }
`;
