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
  flex-grow: inherit;
  padding: 8.3333%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;

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
    height: auto;
    min-height: 0;
    max-height: calc(100vh - 116px);
    padding-left: 16.6666%;
  }
`;

export const InfoWrapper = styled(Box)`
  width: 70%;
  margin: 20px 0 20px 0;
`;

export const FrenchDescription =styled(Box)`
font-size: auto;
padding-bottom: 20px;
`;

export const CTAMessage = styled(Box)`
  position: relative;
  z-index: 2;

  h3 {
    margin-bottom: 8px;
    max-width: 50vw;
  }

  p {
    margin-bottom: 10px;
    max-width: 60vw;
  }

  button {
    &:not(:last-child) {
      margin-bottom: 40px;
    }
  }

  ${(props) => props.theme.breakpoints.up('md')} {
  }
`;
