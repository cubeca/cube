import { Button as MuiButton, ButtonProps } from '@mui/material';
import { FC } from 'react';
import * as s from './Button.styled';

const Button: FC<ButtonProps> = ({ children, ...rest }) => (
  <s.Button variant="contained" {...rest}>
    {children}
  </s.Button>
);
export default Button;
