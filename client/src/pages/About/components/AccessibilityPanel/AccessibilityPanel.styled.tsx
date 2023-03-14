import { Box, Stack } from '@mui/material';
import { styled } from 'theme/utils';

export const IconsRow = styled(Stack)``;

export const IconDefinition = styled(Stack)`
  text-align: center;

  img {
    display: block;
    margin: 0 auto 24px;
    width: 60px;
    height: 60px;
    object-fit: contain;
  }
`;
