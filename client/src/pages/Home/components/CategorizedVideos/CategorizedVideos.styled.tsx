import { List } from '@mui/material';
import { styled } from 'theme/utils';

export const Categories = styled(List)`
  background: ${({ theme }) => theme.palette.grey[800]};
  border-radius: ${({ theme }) => theme.shape.borderRadius};
  display: flex;
  align-items: center;
  padding: 0;
`;
