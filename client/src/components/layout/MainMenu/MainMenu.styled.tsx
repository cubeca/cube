import { styled } from 'theme/utils';
import { Button, Divider, Menu, MenuList, Typography } from '@mui/material';

export const MainMenu = styled(Menu)`

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
    opacity: 0.2 !important;
    margin-top: 16px;
  }
  
  h3 {
    margin: 12px 0 24px 0;
  }

  h4 {
    font-size: 14px;
    margin: 8px 16px;
  }

  li {
    margin-bottom: 4px;
    padding-right: 64px;
  }

`;