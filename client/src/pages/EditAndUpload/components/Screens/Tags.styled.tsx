import { Typography } from '@mui/material';
import Button from 'components/Button';
import TextInput from 'components/form/TextInput';
import { styled } from 'theme/utils';

export const StyledTextInput = styled(TextInput)`
  background-color: #d9ffee !important;
  margin: 0;
  padding: 0;
`;

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
  line-height: 20px;
`;

export const StyledList = styled('ul')`
  color: #d9ffee;
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  padding: 0;
  list-style-position: inside;
`;

export const StyledListItem = styled('li')`
  line-height: 26px;
  margin: 0;
  text-indent: -1.3em;
  padding-left: 1.5em;
`;

export const StyledListSpan = styled('span')`
  color: #d9ffee;
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  line-height: 26px;
  font-weight: 400;
`;

export const StyledInputLabel = styled(Typography)`
  ${({ theme }) => `
    marginTop: ${theme.spacing(3)};
    justify-content: center;
    align-items: center;
    color: #D9FFEE;
    font-family: Inter;
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: 26px; 
    ${theme.breakpoints.down('sm')} {
      marginTop: ${theme.spacing(0)};
    }
  `}
`;
