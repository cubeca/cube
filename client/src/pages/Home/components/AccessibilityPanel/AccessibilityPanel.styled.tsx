import { Box, Grid, Stack } from '@mui/material';
import { containerClasses } from '@mui/system';
import { styled } from 'theme/utils';

export const AccessibilityPanel = styled(Box)`
  padding: 24px 8.333333333333333%;
  
  ${(props) => props.theme.breakpoints.up('md')} {
    padding: 10vw 8.333333333333333%;
  }

  a {
    color: ${(props) => props.theme.palette.primary.main};
    display: inline;
  }
  h2{
    margin-bottom: 3px;
  }
  h3{
    margin-bottom: 2rem;
  }
  p{
    margin-bottom: 1rem;
  }
`;

export const IconDefinition = styled(Stack)`
  text-align: center;
  padding: 0 24px 48px;

  ${(props) => props.theme.breakpoints.up('md')} {
    padding: 0 16px 0;
  }

  .MuiSvgIcon-root {
    display: block;
    margin: 0 auto 24px;
    width: 60px;
    height: 60px;
    
    path {
      fill: ${(props) => props.theme.palette.primary.main};
    }
  }
`;
