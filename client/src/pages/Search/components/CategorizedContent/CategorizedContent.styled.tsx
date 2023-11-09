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
    position: relative;
    display: block;
    margin: -32px auto 0;
    width: 64px !important;
    height: 192px !important;

    svg {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
    }
  }
`;
