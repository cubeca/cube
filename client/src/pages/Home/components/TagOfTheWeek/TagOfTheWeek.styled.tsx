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
    flex-flow: row nowrap;
    margin: -15px;
    padding-left: 8.333333333333333%;
    padding-right: 8.333333333333333%;
    overflow-x: auto;

    > * {
      flex: 0 0 360px;
      margin: 15px;
    }
  }
`;
