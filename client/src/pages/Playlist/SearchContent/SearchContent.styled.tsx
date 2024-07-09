import { Box, Typography } from '@mui/material';
import { styled } from 'theme/utils';
import { Link } from 'react-router-dom';

export const UserContentWrapper = styled(Box)`
  margin-top: 60px;
  margin-bottom: 60px;
`;

export const PlaylistItemContainer = styled(Box)`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  border-bottom: 1px solid #57838b;
`;

export const PlaylistItemSubContainer = styled(Box)`
  display: flex;
  align-items: center;
`;
export const PlaylistItemTitle = styled(Typography)`
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 21px;
  padding: 15px 0;
  margin: 0;
`;

export const UserContent = styled(Box)`
  ${(props) => props.theme.breakpoints.up('md')} {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-content: flex-start;
    flex-flow: row wrap;
    margin: -15px;

    .content-card {
      flex: 0 0 calc(33.3333% - 30px);
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

export const LoadMoreContainer = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;
export const LoadMore = styled(Link)`
  display: block;
  text-decoration: none !important;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  transition: transform 0.15s ease-in-out;

  ${(props) => props.theme.breakpoints.up('md')} {
    flex: 0 0 calc(33.3333% - 30px);
    margin: 15px;
  }

  &:hover {
    transform: scale(1.05);
  }

  .inner {
    display: block;
    background-color: ${(props) => props.theme.palette.primary.main};
    border-radius: 5px;
    color: ${(props) => props.theme.palette.background.default};
  }

  .label {
    display: block;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    line-height: 100%;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;

    &::before {
      display: block;
      content: '';
      top: 50%;
      left: 50%;
      width: 52px;
      height: 44px;
      background: no-repeat center/contain;
      background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTMiIGhlaWdodD0iNDUiIHZpZXdCb3g9IjAgMCA1MyA0NSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNi41IiBjeT0iMjIuNSIgcj0iNiIgZmlsbD0iIzI4MzQzQyIvPgo8Y2lyY2xlIGN4PSIyNi41IiBjeT0iMjIuNSIgcj0iNiIgZmlsbD0iIzI4MzQzQyIvPgo8Y2lyY2xlIGN4PSI0Ni41IiBjeT0iMjIuNSIgcj0iNiIgZmlsbD0iIzI4MzQzQyIvPgo8L3N2Zz4K');
    }
  }
`;
