import { Stack } from '@mui/material';
import { styled } from 'theme/utils';
import Gradient  from 'assets/images/gradient-top.jpeg'

export const Header = styled(Stack)`
  // border-bottom: solid 1px #e5e5e5;
  margin-bottom: 2rem;
  z-index: 20;
  background: url(${Gradient});
  background-position: top;
`;
