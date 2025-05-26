import FormControl from '../FormControl';
import { FormControlLabel } from '@mui/material';
import { styled } from 'theme/utils';
import Switch from '@mui/material/Switch';

export const FormWrapper = styled(FormControl)``;

export const FormLabel = styled(FormControlLabel)`
  align-items: flex-start !important;

  .MuiFormControlLabel-label {
    font-size: 1rem !important;
  }
`;

export const EmbedToggleButton = styled('button')<{ checked: boolean; colormode: 'light' | 'dark' }>`
  position: relative;
  display: inline-flex;
  align-items: center;
  width: 58px;
  height: 38px;
  padding: 12px;
  border: 0;
  border-radius: 20px;
  cursor: pointer;
  background-color: ${({ theme, checked, colormode }) =>
    checked
      ? colormode === 'dark'
        ? theme.palette.background.default
        : theme.palette.primary.light
      : theme.palette.grey[500]};
  transition: background-color 0.2s;

  &:focus {
    outline: 2px solid ${({ theme, colormode }) => 
      colormode === 'dark' ? theme.palette.primary.light : theme.palette.primary.main};
    outline-offset: 2px;
  }

  &:focus:not(:focus-visible) {
    outline: none;
  }

  &::before {
    content: '';
    position: absolute;
    left: ${({ checked }) => (checked ? '32px' : '4px')};
    width: 20px;
    height: 20px;
    background-color: white;
    border-radius: 50%;
    transition: left 0.2s;
  }
`;
