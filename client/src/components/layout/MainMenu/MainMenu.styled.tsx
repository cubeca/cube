import { Popper, Box } from '@mui/material';
import { styled } from 'theme/utils';

export const MainMenu = styled(Popper)`
  z-index: 1000 !important;
  position: fixed !important;
  transform: translate3d(0px, 0px, 0px) !important;
  top: 0 !important;
  right: 0 !important;
  left: auto !important;
  width: 100%;
  max-height: 100%;
  overflow-y: auto;
  color: ${(props) => props.theme.palette.background.default} !important;
  background-color: ${(props) => props.theme.palette.primary.main} !important;
  box-shadow: 0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12);

  ${(props) => props.theme.breakpoints.up('md')} {
    width: auto;
    height: auto;
    min-width: 300px;
    margin-top: 31px !important;
    margin-right: 4.4444% !important;
    max-height: calc(100vh - 62px);
    border-radius: ${(props) => props.theme.shape.borderRadius}px;
  }

  .MuiList-root {
    padding: 0 !important;
  }

  .close-button {
    display: block;
    padding: 16px 0 0 0;
    margin-left: auto;
    margin-right: 0;

    circle,
      path {
        fill: ${(props) => props.theme.palette.background.default} !important;
      }
  }

  .MuiList-padding {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }

  .MuiDivider-root {
    border-color: ${(props) => props.theme.palette.background.default} !important;
    margin-top: 16px;
  }

  li {
    margin-bottom: 4px;
  }

`;

export const MenuHashItem = styled('li')`
  padding: 6px 20px;

  a {
    display: block;
    color: ${(props) => props.theme.palette.background.default} !important;
    text-decoration: none;
    font-size: ${(props) => props.theme.typography.body1.fontSize} !important;  
    font-weight: 500 !important;
  }

  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }
`;

export const Glossary = styled(Box)`
  padding: 1px 0 80px;
  background-color: #D8FFEE;
  
  ${(props) => props.theme.breakpoints.up('md')} {
    padding: 1px 0;
  }

  h3 {
    margin: 0 0 12px 0;
  }

  h4 {
    font-size: 14px;
    margin: 16px 16px 8px;
    color: ${(props) => props.theme.palette.primary.dark} !important;
  }

  circle,
      path {
        fill: ${(props) => props.theme.palette.background.default} !important;
      }
`;