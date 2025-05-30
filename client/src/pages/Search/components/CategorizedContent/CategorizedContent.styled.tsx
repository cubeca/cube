import { Box, Grid } from '@mui/material';
import { styled } from 'theme/utils';
import { Link } from 'react-router-dom';

export const ContentWrapper = styled(Box)`
  margin-top: 8.333333333333333%;
  margin-bottom: 8.333333333333333%;

  ${(props) => props.theme.breakpoints.up('md')} {
    margin-top: 4.166666666666667%;
    margin-bottom: 4.166666666666667%;
  }
`;

export const ContentHeader = styled(Grid)`
margin-top: 32px;
margin-bottom: 32px;

  ${(props) => props.theme.breakpoints.up('md')} {
    margin-top: 24px;
  }

  span {
    color: ${(props) => props.theme.palette.primary.light};
  }
`;

export const Content = styled(Box)`
  display: flex;
  flex-flow: row wrap;
  margin: -10px;

  > * {
    flex: 1 1 100%;
    margin: 10px;
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    > * {
      flex: 0 0 calc(50% - 20px);
      margin: 10px;
    }
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

export const LoadMore = styled(Link)`
  display: block;
  text-decoration: none !important;
  text-align: center;
  font-size: 16px;
  font-weight: 500;
  transition: transform 0.15s ease-in-out;

  &:hover {
    transform: scale(1.05);
  }

  .inner {
    position: relative;
    display: block;
    padding-bottom: 100%;
    background-color: ${(props) => props.theme.palette.primary.main};
    border-radius: 5px;
    color: ${(props) => props.theme.palette.background.default};
  }

  .label {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    line-height: 100%;
    padding: 60px 15px 0;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;

    &::before {
      display: block;
      content: '';
      position: absolute;
      top: 40%;
      left: 50%;
      margin: -22px 0 0 -26px;
      width: 52px;
      height: 44px;
      background: no-repeat center/contain;
      background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTMiIGhlaWdodD0iNDUiIHZpZXdCb3g9IjAgMCA1MyA0NSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNi41IiBjeT0iMjIuNSIgcj0iNiIgZmlsbD0iIzI4MzQzQyIvPgo8Y2lyY2xlIGN4PSIyNi41IiBjeT0iMjIuNSIgcj0iNiIgZmlsbD0iIzI4MzQzQyIvPgo8Y2lyY2xlIGN4PSI0Ni41IiBjeT0iMjIuNSIgcj0iNiIgZmlsbD0iIzI4MzQzQyIvPgo8L3N2Zz4K');
    }
  }
`;
