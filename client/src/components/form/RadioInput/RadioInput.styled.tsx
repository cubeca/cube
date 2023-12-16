import { styled } from 'theme/utils';
import RadioInput from './RadioInput';

export const DarkRadioInput = styled(RadioInput)`
  & label,
  .Mui-focused {
    color: ${(props) => props.theme.palette.background.default};
    display: block;
    font-size: 1rem;
    font-weight: 400;
    margin-bottom: 0;
  }
  .MuiRadio-root {
    color: ${(props) => props.theme.palette.background.default};
  }
`;
