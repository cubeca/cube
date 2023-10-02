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
  
  .types{
    position: absolute;
    left: 8px;
    bottom: 8px;
    width: calc(100% - 16px);
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;

    ${(props) => props.theme.breakpoints.up('md')} {
      left: 16px;
      bottom: 16px;
      width: calc(100% - 32px);
    }
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
