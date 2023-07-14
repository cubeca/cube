import { Box } from '@mui/material';
import { styled } from 'theme/utils';

export const Footer = styled(Box)`
  position: relative;
  z-index: 10;
  background-color: #2E4148;
  padding: 45px 0;

  ${(props) => props.theme.breakpoints.up('md')} {
    padding: 60px 0;
  }
`;

export const Credits = styled(Box)`
  position: relative;
  height: 82px;

  svg {
    position: absolute;
    top: 0;
    left: 0;
    max-width: 100%;
    height: 100%;
  }
`;
