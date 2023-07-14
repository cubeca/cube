import { Box, List, ListItem } from '@mui/material';
import { styled } from 'theme/utils';

export const SocialList = styled(List)`
  columns: 2;
  padding: 0;
  margin: 36px 0 20px;

  ${(props) => props.theme.breakpoints.up('md')} {
  }
`;

export const SocialItem = styled(ListItem)`
  padding: 0;
`;