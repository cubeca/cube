import { styled as muiStyled } from '@mui/material';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const styled = (component: any) =>
  muiStyled(component, {
    shouldForwardProp: (prop: string) => !prop.startsWith('$')
  });
