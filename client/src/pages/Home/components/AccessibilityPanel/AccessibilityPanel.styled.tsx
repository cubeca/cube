import { Box, Stack } from '@mui/material';
import { styled } from 'theme/utils';

export const AccessibilityPanel = styled(Box)`
  padding: 24px 8.333333333333333%;
  
  ${(props) => props.theme.breakpoints.up('md')} {
    padding: 120px 8.333333333333333%;
  }

  a {
    color: ${(props) => props.theme.palette.primary.main};
    display: inline;
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
