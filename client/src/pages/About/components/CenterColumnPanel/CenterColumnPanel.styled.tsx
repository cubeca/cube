import { Box } from '@mui/material';
import { styled } from 'theme/utils';

export const CenterColumnPanel = styled(Box)`
  z-index: 2;
  padding-bottom: 80px;
`;

export const CenterColumnTextSection = styled(Box)`
  padding: 56px 0 0;

  &:last-child {
    padding-bottom: 56px;
  }
`;
