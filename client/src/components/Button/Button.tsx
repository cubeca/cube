import { Button as MuiButton, ButtonProps } from '@mui/material';
import { FC } from 'react';

const Button: FC<ButtonProps> = ({ children, ...rest }) => (
  <MuiButton variant="contained" {...rest} sx={{fontSize: '1rem', marginTop: '1rem'}}>
    {children}
  </MuiButton>
);
export default Button;
