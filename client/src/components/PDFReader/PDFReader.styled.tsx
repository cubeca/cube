import { styled } from 'theme/utils';
import {
  Box,
  Grid,
  ToggleButtonGroup,
  ToggleButton,
  IconButton
} from '@mui/material';

export const PDFReaderContainer = styled(Box)`
  background-color: #1a1919;

  ${(props) => props.theme.breakpoints.up('xs')} {
    padding: ${({ theme }) => theme.spacing(0)};
  }
  ${(props) => props.theme.breakpoints.up('md')} {
    padding: ${({ theme }) => theme.spacing(1)};
  }

  ${(props) => props.theme.breakpoints.up('md')} {
    padding-top: ${({ theme }) => theme.spacing(2)};
  }

  position: relative;
`;

export const ButtonContainer = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  ${(props) => props.theme.breakpoints.up('xs')} {
    padding-bottom: ${({ theme }) => theme.spacing(1.5)};
  }
  ${(props) => props.theme.breakpoints.up('md')} {
    padding-bottom: ${({ theme }) => theme.spacing(4)};
  }
`;

export const MobileButtonContainer = styled(Box)`
  ${(props) => props.theme.breakpoints.up('xs')} {
    display: flex;
  }
  ${(props) => props.theme.breakpoints.up('sm')} {
    display: flex;
  }
  ${(props) => props.theme.breakpoints.up('md')} {
    display: none;
  }
  width: 100%;
  height: 90px;
  justify-content: space-evenly;
  align-items: center;
`;

export const StyledAbsoluteIconButton = styled(IconButton)`
  position: absolute;
  top: 10px;
  right: 10px;
  color: primary.main;
  ${(props) => props.theme.breakpoints.up('xs')} {
    display: none;
  }
  ${(props) => props.theme.breakpoints.up('sm')} {
    display: none;
  }
  ${(props) => props.theme.breakpoints.up('md')} {
    display: flex;
  }
  '& svg': {
    font-size: 6rem;
  }
`;

export const SinglePageContainer = styled(Box)`
  ${(props) => props.theme.breakpoints.up('lg')} {
    height: 100vh;
  }
  max-height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const ArrowIconButton = styled(IconButton)`
  color: ${(props) => props.theme.palette.primary.main};
  height: ${(props) => props.height || '100px'};
  & svg {
    font-size: ${(props) => props.size || '4rem'};
  }
  &.Mui-disabled {
    color: theme.palette.grey[500];
  }
`;

export const AllPagesContainer = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const PageContainer = styled(Box)`
  margin-bottom: 0.5rem;
`;

export const StyledToggleButtonGroup = styled(ToggleButtonGroup)({
  '& .Mui-selected': {
    backgroundColor: 'primary.main',
    color: 'primary.main'
  },
  '& .MuiToggleButton-root:hover': {
    backgroundColor: 'primary.light',
    color: 'primary.contrastText'
  }
});

export const StyledToggleButton = styled(ToggleButton)({
  textTransform: 'none',
  borderRadius: '4px',
  padding: '8px',
  minWidth: 'auto'
});

export const FullscreenModalContainer = styled(Box)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

export const ModalPageContainer = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  marginbottom: 20px;
`;
