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
  line-height: 20px; /* 125% */
`;
