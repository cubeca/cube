import { Box } from '@mui/material';
import { styled } from 'theme/utils';

export const UserContentWrapper = styled(Box)`
  margin-top: 60px;
  margin-bottom: 60px;
`;

export const UserContent = styled(Box)`
  ${(props) => props.theme.breakpoints.up('md')} {
    display: flex;
    flex-flow: row wrap;
    margin: -15px;

    .content-card {
      flex: 0 0 calc(33.3333% - 30px);
      margin: 15px;
    }

    .loading-cubes {
      display: block;
      margin: 0 auto;
      width: 100px;
    }
  }
`;
