import { Card } from '@mui/material';
import { styled } from 'theme/utils';

export const NeighbourCard = styled(Card)<{ $filled?: boolean }>`
  text-align: center;
  padding: 1rem;
  border: solid 1px ${({ theme }) => theme.palette.primary.main};
  background: ${({ theme, $filled }) =>
    $filled ? theme.palette.primary.main : 'none'};
  color: ${({ theme, $filled }) =>
    $filled ? theme.palette.background.default : theme.palette.primary};
  h4 {
    font-size: 1rem;
    text-transform: uppercase;
    font-weight: bold;
  }
`;
