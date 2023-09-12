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
  position: relative;
  background: ${({ theme }) => theme.palette.primary.main};
  min-height: 100vw;
  padding: 8.3333% 0 8.3333% 8.3333%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;

  &::before {
    content: '';
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: transparent url(${LoginBackground}) no-repeat center/cover;
    opacity: 0.5;
  }
  
  ${(props) => props.theme.breakpoints.up('md')} {
    height: 50vw;
    min-height: 0;
    max-height: calc(100vh - 116px);
    padding-left: 16.6666%;
  }
`;

export const CTAMessage = styled(Box)`
  position: relative;
  z-index: 2;

  h3 {
    margin-bottom: 8px;
    max-width: 320px;
  }
  
  p {
    margin-bottom: 4px;
    max-width: 320px;
  }

  button {

    &:not(:last-child) {
      margin-bottom: 48px;
    }
  }

  ${(props) => props.theme.breakpoints.up('md')} {
  }
`;

