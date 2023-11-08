import { Box } from '@mui/material';
import { styled } from 'theme/utils';

export const ContentWrapper = styled(Box)`
  margin-top: 8.333333333333333%;
  margin-bottom: 8.333333333333333%;

  ${(props) => props.theme.breakpoints.up('md')} {
    margin-top: 4.166666666666667%;
    margin-bottom: 4.166666666666667%;
  }
`;

export const Content = styled(Box)`
  display: flex;
  flex-flow: row wrap;
  margin: -10px;

  > * {
    flex: 0 0 calc(50% - 20px);
    margin: 10px;
  }

  ${(props) => props.theme.breakpoints.up('md')} {
    margin: -15px;

    > * {
      flex: 0 0 calc(25% - 30px);
      margin: 15px;
    }
  }

  .loading-cubes {
    display: block;
    margin: 0 auto;
    width: 100px;
  }
`;
