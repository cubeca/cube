import { styled } from 'theme/utils';
import RadioInput from './RadioInput';

export const DarkRadioInput = styled(RadioInput)`
  & label {
    color: ${(props) => props.theme.palette.background.default};
    display: block;
    font-size: 1rem;
    font-weight: 500;
    margin-bottom: 0;
    font-weight: 600;
  }
`;
