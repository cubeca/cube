import { styled } from 'theme/utils';
import { Button, Divider, Menu, MenuList, Typography, Box } from '@mui/material';

export const MainMenu = styled(Menu)`

  .MuiList-root {
    padding: 0 !important;
  }

  .close-button {
    padding: 16px;
  }

  .MuiPaper-root {
    color: ${(props) => props.theme.palette.background.default} !important;
    background-color: ${(props) => props.theme.palette.primary.main} !important;

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
    padding-right: 64px;
  }

`;

export const Glossary = styled(Box)`
  padding: 1px 0;
  background-color: #D8FFEE;

  h3 {
    margin: 0 0 12px 0;
  }

  h4 {
    font-size: 14px;
    margin: 16px 16px 8px;
    color: ${(props) => props.theme.palette.primary.dark} !important;
  }
`;