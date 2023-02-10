import { styled as muiStyled } from '@mui/material';

//*//AC: I don't know that the commented out line is doing?//
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const styled = (component: any) =>
  muiStyled(component, {
    shouldForwardProp: (prop: string) => !prop.startsWith('$')
  });
