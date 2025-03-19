import { Popper, Box, Menu, MenuItem as MuiMenuItem } from '@mui/material';
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
  box-shadow:
    0px 5px 5px -3px rgba(0, 0, 0, 0.2),
    0px 8px 10px 1px rgba(0, 0, 0, 0.14),
    0px 3px 14px 2px rgba(0, 0, 0, 0.12);

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
    border-color: ${(props) =>
      props.theme.palette.background.default} !important;
    margin-top: 16px;
  }

  li {
    margin-bottom: 4px;
  }
`;

export const MenuHashItem = styled('li')`
  padding: 6px 20px;
  border: none !important;
  outline: none !important;
  transition: background-color 0.2s ease;

  a {
    display: block;
    color: ${(props) => props.theme.palette.background.default} !important;
    text-decoration: none;
    font-size: ${(props) => props.theme.typography.body1.fontSize} !important;
    font-weight: 500 !important;
    line-height: 1.5;
    margin-bottom: 1px;
    outline: none !important;
    border: none !important;
  }

  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }

  &:focus {
    background-color: rgba(255, 255, 255, 0.1);
  }

  &:focus-visible {
    outline: 2px solid ${(props) => props.theme.palette.background.default};
    outline-offset: -2px;
  }
`;

export const Glossary = styled(Box)`
  padding: 1px 0 80px;
  background-color: #d8ffee;
  outline: none !important;

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

export const Item = styled(MuiMenuItem)`
  margin-bottom: 1px;
  padding-left: 20px;
  padding-right: 20px;
  transition: background-color 0.2s ease;
  cursor: ${(props) => (props.active ? 'pointer' : 'default')};
  pointer-events: ${(props) => (props.active ? 'auto' : 'none')};

  .MuiTypography-root {
    font-size: ${(props) =>
      props.active ? props.theme.typography.body1.fontSize : '15px'} !important;
    font-weight: ${(props) => (props.active ? '500' : '400')} !important;
    color: ${(props) => props.theme.palette.background.default} !important;
  }

  &:hover {
    background-color: ${(props) =>
      props.active ? 'rgba(255, 255, 255, 0.3)' : 'transparent'};
  }

  &:focus-visible {
    background-color: rgba(255, 255, 255, 0.1);
    outline: 2px solid ${(props) => props.theme.palette.background.default};
    outline-offset: -2px;
  }
`;

export const CloseButton = styled('button')`
  position: absolute;
  top: 16px;
  right: 16px;
  background: transparent;
  border: none;
  padding: 8px;
  margin: 0;
  cursor: pointer;
  color: ${(props) => props.theme.palette.background.default};
  transition: opacity 0.2s ease;
  z-index: 2000;

  &:hover {
    opacity: 0.8;
  }

  svg {
    width: 24px;
    height: 24px;
  }

  &:focus-visible {
    outline: 2px solid ${(props) => props.theme.palette.background.default};
    outline-offset: 2px;
    border-radius: 4px;
  }
`;
