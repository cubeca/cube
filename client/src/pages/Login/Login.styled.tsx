import { Box } from '@mui/material';
import { styled } from 'theme/utils';
import LoginBackground from 'assets/images/login-poster.jpg';

export const FormWrapper = styled(Box)`
  padding: 8.3333% 8.3333% 8.3333% 0;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  height: 100%;

  ${(props) => props.theme.breakpoints.up('md')} {
    padding-right: 16.6666%;
  }
`;

export const CTAWrapper = styled(Box)`
  background: ${({ theme }) => theme.palette.background.paper} url(${LoginBackground}) no-repeat center/cover;
  min-height: 100vw;
  padding: 8.3333% 0 8.3333% 8.3333%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  
  ${(props) => props.theme.breakpoints.up('md')} {
    height: 50vw;
    min-height: 0;
    max-height: calc(100vh - 116px);
    padding-left: 16.6666%;
  }
`;

export const CTAMessage = styled(Box)`

  ${(props) => props.theme.breakpoints.up('md')} {
  }
`;

export const LinkWrapper = styled(Box)`
  display: flex;
  flex-flow: column nowrap;
  align-items: flex-start;
  gap: 8px;
  padding: 0;
  
  ${(props) => props.theme.breakpoints.up('md')} {
    flex-flow: row wrap;
    gap: 24px;
    padding: 1.5rem 0;
  }
`;