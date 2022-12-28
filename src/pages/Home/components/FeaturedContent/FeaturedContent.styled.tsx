import { Stack } from '@mui/material';
import { styled } from 'theme/utils';

export const Filters = styled(Stack)`
  background: ${({ theme }) => theme.palette.grey[800]};
  border-radius: ${({ theme }) => theme.shape.borderRadius};
  padding: 10px;
`;
