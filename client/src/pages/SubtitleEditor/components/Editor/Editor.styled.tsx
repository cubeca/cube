import { Typography, Box } from '@mui/material';
import Button from '../../../../components/Button';
import { styled } from 'theme/utils';

export const WaitWrapper = styled(Box)`
  ${(props) => props.theme.breakpoints.up('md')} {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`;

export const LogoWrapper = styled(Box)`
  ${(props) => props.theme.breakpoints.up('md')} {
    display: flex;
    justify-content: center;

    .loading-cubes {
      display: block;
      margin: 0 auto;
    }
  }
`;

//styled loading text
export const StyledLoadingText = styled(Typography)`
  ${({ theme }) => `
    color: #D9FFEE;
    font-family: Roboto;
    font-size: 20px;
    font-style: normal;
    font-weight: 400;
    ${theme.breakpoints.down('sm')} {
      marginTop: ${theme.spacing(0)};
    }
  `}
`;

export const ErrorText = styled(Typography)`
  ${({ theme }) => `
    color: #FFB7C4;
    font-family: Roboto;
    font-size: 20px;
    font-style: normal;
    font-weight: 400;
    ${theme.breakpoints.down('sm')} {
      marginTop: ${theme.spacing(0)};
    }
  `}
`;

//Style like input
export const StyledText = styled(Typography)`
  margin-bottom: 32px;
  box-sizing: border-box;
`;

export const StyledButtonEdit = styled(Button)`
  height: 58px;
  width: 100%;
  line-height: 20px;
  font-size: 16px;
  margin-bottom: 48px;
  padding: 0;
  color: #d9ffee;
  text-align: center;
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
`;

export const StyledButtonDisplay = styled(Button)`
  margin-top: 14px;
  height: 58px;
  width: 100%;
  line-height: 20px;
  font-size: 16px;
  margin-bottom: 32px;
  padding: 0;
  color: #d9ffee;
  text-align: center;
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
`;
