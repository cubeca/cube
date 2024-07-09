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
  padding-top: 70px;
  padding-bottom: 120px;
  text-align: left;

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

  span {
    font-size: 1rem;
    color: ${({ theme }) => theme.palette.primary.light};
  }

  .play-button {
  }
`;
