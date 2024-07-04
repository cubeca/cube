import { Box, Link, Stack } from '@mui/material';
import { styled } from 'theme/utils';

export const Action = styled(Link)`
  color: ${(props) => props.theme.palette.primary.light} !important;
  font-weight: 500;
  margin-left: 0.5rem;

  a {
    color: inherit;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const ActionsWrapper = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1.5rem;
`;

export const ViewSection = styled(Stack)`
  position: relative;
  align-items: center;
  margin-top: 16px;
  z-index: 3;

  ${(props) => props.theme.breakpoints.up('md')} {
    position: fixed;
    overflow-y: auto;
    top: 120px;
    right: 0;
    width: 25vw;
    height: calc(100vh - 120px);
    margin-top: 0;

    &::before {
      display: none;
    }
  }
`;

export const Header = styled(Box)`
  text-align: center;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;

  ${(props) => props.theme.breakpoints.up('md')} {
    height: 360px;
    flex: 0 0 360px;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
  }

  small {
    display: block;
    font-size: 14px;
    margin: 4px 0;
    font-weight: 600;
    color: ${(props) => props.theme.palette.primary.main};
  }

  a {
    color: inherit;
    text-decoration: none;
  }
`;

export const ImageWrapper = styled(Box)`
  position: relative;
  width: 100px;
  height: 100px;
  margin-bottom: 16px;

  ${(props) => props.theme.breakpoints.up('md')} {
    width: 160px;
    height: 160px;
  }
`;

export const ImageInner = styled('a')`
  display: block;
  position: relative;
  width: 100px;
  height: 100px;
  border: 4px solid ${(props) => props.theme.palette.primary.dark};
  background-color: ${(props) => props.theme.palette.primary.dark};
  border-radius: 80px;
  text-decoration: none;
  overflow: hidden;

  ${(props) => props.theme.breakpoints.up('md')} {
    width: 160px;
    height: 160px;
  }

  .loading-circle {
    opacity: 0.35;
    position: absolute;
    top: 50%;
    left: 50%;
    width: 64px;
    height: 64px;
    transform: translate(-50%, -50%);
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
