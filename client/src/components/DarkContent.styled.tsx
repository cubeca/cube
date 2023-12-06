import { Box } from '@mui/material';
import { styled } from 'theme/utils';

export const Wrapper = styled(Box)`
  a {
    color: ${(props) => props.theme.palette.primary.main};
    text-decoration: underline;

    &:hover {
      color: ${(props) => props.theme.palette.primary.light};
      text-decoration: underline;
    }
  }
`;
