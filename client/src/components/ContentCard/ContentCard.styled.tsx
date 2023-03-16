import { Box, Stack } from '@mui/material';
import { styled } from 'theme/utils';

export const ContentCard = styled(Box)`
  a {
    display: block;
    color: ${(props) => props.theme.palette.primary.light};
    text-decoration: none;
  }
`;

export const Thumbnail = styled(Box)`
  position: relative;
  padding-bottom: 100%;
  background: no-repeat center/cover;

  img {
    position: absolute;
    left: 20px;
    bottom: 20px;
  }
`;

export const Data = styled(Stack)`
  justify-content: space-between;
  margin-top: 8px;

  span {
    font-size: 16px;

    &.title {
      font-weight: 600;
    }

    &.creator {
    }
  }
`;
