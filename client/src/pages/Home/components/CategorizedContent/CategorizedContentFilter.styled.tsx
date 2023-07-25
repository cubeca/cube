import { Stack } from '@mui/material';
import { styled } from 'theme/utils';

export const Filters = styled(Stack)`
  margin-bottom: 8px;
  
  ${(props) => props.theme.breakpoints.up('md')} {
    margin-bottom: 16px;
  }
`;