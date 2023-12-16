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

export const WrappingDarkRadioInput = styled(RadioInput)`
  & label,
  .Mui-focused {
    color: ${(props) => props.theme.palette.background.default};
    display: flex;
    font-size: 1rem;
    font-weight: 400;
    margin-bottom: 0;
    position: relative;
    padding-left: 50px;
  }
  .MuiRadio-root {
    color: ${(props) => props.theme.palette.background.default};
    position: absolute;
    left: 0;
    top: 0;
  }
`;
