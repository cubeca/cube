import { Box, Stack } from '@mui/material';
import { styled } from 'theme/utils';

export const ContentCard = styled(Box)`
  a {
    display: block;
    color: ${(props) => props.theme.palette.primary.light};
    text-decoration: none;

    &:hover {
      .types {
        color: ${(props) => props.theme.palette.primary.main};
      }
    }
  }
`;

export const Thumbnail = styled(Box)`
  position: relative;
  padding-bottom: 100%;
  background: no-repeat center/cover;
`;

export const ImageWrapper = styled(Box)`
  position: relative;
  padding-bottom: 100%;
  overflow: hidden;
  
  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const Data = styled(Stack)`
  justify-content: space-between;
  margin-top: 8px;

  .title {
    font-size: 16px;
    line-height: 24px;
    height: 24px;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;  
    overflow: hidden;
  }

  .creator {
  }
  
  .types{
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    color: ${(props) => props.theme.palette.secondary.dark};

    ${(props) => props.theme.breakpoints.up('md')} {
    }
  }
  
`;
