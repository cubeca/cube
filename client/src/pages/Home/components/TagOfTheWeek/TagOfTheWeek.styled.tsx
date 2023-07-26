import { Box, Stack } from '@mui/material';
import Grid from '@mui/system/Unstable_Grid';
import { styled } from 'theme/utils';

export const ContentWrapper = styled(Box)`
  position: relative;
  z-index: 3;
  margin-bottom: 16px;
  
  ${(props) => props.theme.breakpoints.up('md')} {
    margin-bottom: 32px;
  }
`;

export const ContentHeader = styled(Grid)`
  margin-top: 16px;
  margin-bottom: 32px;
  
  ${(props) => props.theme.breakpoints.up('md')} {
    margin-top: 32px;
    margin-top: 0;
  }

  span {
    color: ${(props) => props.theme.palette.primary.light};;
  }
`;

export const Content = styled(Box)`
  
  swiper-container {
    margin: -10px;
    width: calc(100% + 10px);

    .swiper-button-prev {
      font-size: 0 !important;
    }

    .swiper-button-next {
      font-size: 0 !important;
      border: 3px solid red !important;
    }
  }

  swiper-slide {
    width: auto;
    margin: 10px;

    > * {
      width: 240px;
    }

    &:first-child {
      padding-left: 8.333333333333333%;
    }
    
    &:last-child {
      padding-right: 8.333333333333333%;
    }
  }

 

  ${(props) => props.theme.breakpoints.up('md')} {

    swiper-container {
      margin: -15px;
      width: calc(100% + 15px);
    }

    swiper-slide {
      margin: 15px;

      > * {
        width: 360px;
      }
    }
    
  }
`;

export const ContentCSSOnly = styled(Box)`
  display: flex;
  flex-flow: row nowrap;
  margin: -10px;
  padding-left: 8.333333333333333%;
  padding-right: 8.333333333333333%;
  overflow-x: auto;
  width: calc(100% + 10px);

  > * {
    flex: 0 0 240px;
    margin: 10px;
  }

  ${(props) => props.theme.breakpoints.up('md')} {
    margin: -15px;
    width: calc(100% + 15px);

    > * {
      flex: 0 0 360px;
      margin: 15px;
    }
    
  }
`;
