import { Menu, Button } from '@mui/material';
import { Box } from '@mui/system';
import { styled } from 'theme/utils';

export const ProfileButton = styled(Button)`
  padding: 0;
  min-width: 0;
`;

export const ImageWrapper = styled(Box)`
  position: relative;
  width: 48px;
  height: 40px;
  
  ${(props) => props.theme.breakpoints.up('md')} {
    width: 32px;
    height: 32px;
  }
`;

export const ImageInner = styled('div')`
  display: block;
  position: absolute;
  top: -4px;
  left: 0;
  width: 48px;
  height: 48px;
  border: 2px solid ${(props) => props.theme.palette.primary.dark};
  background-color: ${(props) => props.theme.palette.primary.dark};
  border-radius: 100px;
  text-decoration: none;
  overflow: hidden;

  .loading-circle {
    opacity: 0.35;
    position: absolute;
    top: 50%;
    left: 50%;
    width: 32px;
    height: 32px;
    transform: translate(-50%, -50%);

    ${(props) => props.theme.breakpoints.up('md')} {
      width: 24px;
      height: 24px;
    }
  }

  ${(props) => props.theme.breakpoints.up('md')} {
    top: 0;
    width: 32px;
    height: 32px;
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

export const Label = styled(Box)`
  display: none;

  ${(props) => props.theme.breakpoints.up('md')} {
    display: inline;
  }
`;

export const ProfileMenu = styled(Menu)`
  .MuiPaper-root {
    color: ${(props) => props.theme.palette.background.default};
    background-color: ${(props) => props.theme.palette.primary.main};

    circle,
      path {
        fill: ${(props) => props.theme.palette.background.default};
      }
  }
`;