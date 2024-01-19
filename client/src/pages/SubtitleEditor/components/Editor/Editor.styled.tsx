import { Grid, Typography, Box } from '@mui/material';
import Button from '../../../../components/Button';
import TextInput from '../../../../components/form/TextInput';
import { styled } from 'theme/utils';

export const StyledButton = styled(Button)`
  margin-top: 14px;
  height: 58px;
  width: 100%;
  line-height: 20px;
  font-size: 16px;
  padding: 0;
  color: #d9ffee;
  text-align: center;
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px; /* 125% */
`;

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
