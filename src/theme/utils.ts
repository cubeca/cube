import { styled as muiStyled } from '@mui/material';

export const styled = (component: any) =>
  muiStyled(component, {
    shouldForwardProp: (prop: string) => !prop.startsWith('$')
  });
