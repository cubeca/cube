/**
 * This component is a custom button that wraps the Material-UI Button component, providing a consistent styled button across the application.
 * It accepts all the props that a Material-UI Button component does (`ButtonProps`) and passes them along to the Material-UI Button,
 * along with its children. The button is styled using styled-components defined in `Button.styled`, and it defaults to a "contained" variant.
 */

import { Button as MuiButton, ButtonProps } from '@mui/material';
import { FC } from 'react';
import * as s from './Button.styled';

const Button: FC<ButtonProps> = ({ children, ...rest }) => (
  <s.Button variant="contained" {...rest}>
    {children}
  </s.Button>
);
export default Button;
