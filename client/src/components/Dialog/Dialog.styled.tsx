import { styled } from 'theme/utils';
import {
  Box,
  Dialog as MuiDialog,
  DialogTitle,
  IconButton
} from '@mui/material';

export const Wrapper = styled(MuiDialog)`
  margin: -12px -12px 64px;

  ${(props) => props.theme.breakpoints.up('sm')} {
    margin: 0;
  }
`;

export const Title = styled(DialogTitle)`
  width: 600px;
  max-width: 100%;
  background-color: ${(props) => props.theme.palette.primary.main};
  color: ${(props) => props.theme.palette.background.default};
  
  ${(props) => props.theme.breakpoints.up('sm')} {
  }

  * {
    color: ${(props) => props.theme.palette.background.default} !important;
  }
`;

export const Close = styled(IconButton)`
  position: absolute;
  right: 8px;
  top: 8px;
  color: ${(props) => props.theme.palette.background.default};
`;

export const Body = styled(Box)`
  color: ${(props) => props.theme.palette.background.default};
  background-color: ${(props) => props.theme.palette.primary.main};
  padding: 24px 20px 40px;
  
  ${(props) => props.theme.breakpoints.up('sm')} {
    padding: 24px;
  }
`;

