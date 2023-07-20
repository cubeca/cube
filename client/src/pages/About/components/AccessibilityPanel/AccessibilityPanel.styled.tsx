import { Box, Stack } from '@mui/material';
import { styled } from 'theme/utils';

export const IconsRow = styled(Stack)`

`;

export const IconDefinition = styled(Stack)`
  text-align: center;
  padding: 0 24px 48px;

  ${(props) => props.theme.breakpoints.up('md')} {
    padding: 0 16px 0;
  }

  img {
    display: block;
    margin: 0 auto 24px;
    width: 60px;
    height: 60px;
    object-fit: contain;
  }
`;
