import { Box } from '@mui/material';
import { styled } from 'theme/utils';

export const CTA = styled(Box)`
  position: relative;
  width: 100%;
  
  background: ${(props) => props.theme.palette.primary.light};

  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-left: -8.333333333333334vw;
    margin-right: -8.333333333333334vw;
    width: auto;
  }

  ${(props) => props.theme.breakpoints.up('md')} {
    height: 0;
    padding-bottom: 100%;
  }
`;

export const CTAContent = styled(Box)`
  padding: 8.333333333333334vw;
  min-height: 50vw;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;

  ${(props) => props.theme.breakpoints.up('md')} {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 50%;
    min-height: auto;
    padding: 40px;
  }

  h2 {
    font-weight: 600;
    margin-bottom: 16px;
  }

  p {}

  > *:last-child {
    margin-bottom: 0;
  }
`;

export const CTAVideo = styled(Box)`
  position: relative;
  width: 100%;
  height: 50vw;

  .play-button {
    position: absolute;
    left: 8.333333333333334vw;
    bottom: 8.333333333333334vw;

    svg {
      path {
        fill: ${(props) => props.theme.palette.primary.light};
      }
    }
  }

  ${(props) => props.theme.breakpoints.up('md')} {
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    height: 50%;

    .play-button {
      left: 40px;
      bottom: 60px;
    }
  }
`;