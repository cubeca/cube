import { Box, Stack } from '@mui/material';
import { styled } from 'theme/utils';

export const ContentWrapper = styled(Box)`
  position: relative;
  z-index: 3;
  margin-bottom: 60px;
`;


export const Content = styled(Box)`

  ${(props) => props.theme.breakpoints.up('md')} {
    display: flex;
    flex-flow: row wrap;
    margin: -15px;

    > * {
      flex: 0 0 calc(33.3333% - 30px);
      margin: 15px;
    }
  }
`;
