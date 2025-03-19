import { Box, Stack } from '@mui/material';
import { styled } from 'theme/utils';

export const HeroPanelHome = styled(Stack)`
  position: relative;
  background-color: rgba(47, 64, 72, 1);
`;

export const Bg = styled(Box)`
  position: absolute;
  top: -78px;
  left: 0;
  width: 100%;
  height: 100vw;

  ${(props) => props.theme.breakpoints.up('md')} {
    top: -116px;
    bottom: 360px;
    height: auto;
  }

  &::before {
    content: '';
    display: block;
    position: absolute;
    z-index: 2;
    top: 0;
    left: 0;
    width: 100%;
    height: 116px;
    background: linear-gradient(
      180deg,
      rgba(40, 52, 60, 0) 0%,
      rgba(40, 52, 60, 0.7) 50%,
      rgba(40, 52, 60, 1) 100%
    );

    ${(props) => props.theme.breakpoints.up('md')} {
      height: 232px;
    }
  }

  &::after {
    content: '';
    display: block;
    position: absolute;
    z-index: 2;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 232px;
    background: linear-gradient(
      180deg,
      rgba(40, 52, 60, 0) 0%,
      rgba(40, 52, 60, 0.7) 50%,
      rgba(40, 52, 60, 1) 100%
    );

    ${(props) => props.theme.breakpoints.up('md')} {
      height: 464px;
    }
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
  padding-bottom: 18.333333333333334vw;

  ${(props) => props.theme.breakpoints.up('md')} {
    padding-bottom: 8.333333333333334vw;
  }
`;

export const Headline = styled(Box)`
  padding: 55vw 0 8.333333333333334vw 0;

  ${(props) => props.theme.breakpoints.up('md')} {
    padding: 8.333333333333334vw 0;
  }

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
