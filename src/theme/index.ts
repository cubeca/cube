import { createTheme, responsiveFontSizes } from '@mui/material';

const DEFAULT_BORDER_RADIUS = '5px';
const DEFAULT_FONT_SIZE = 16;
const FONT_FAMILY = ['Arimo'].join(',');
const DEFAULT_THEME_MODE = 'dark';

const getTheme = (mode?: 'dark' | 'light') =>
  responsiveFontSizes(
    createTheme({
      shape: {
        borderRadius: DEFAULT_BORDER_RADIUS,
      },
      typography: {
        fontFamily: FONT_FAMILY,
        fontSize: DEFAULT_FONT_SIZE,
      },
      palette: {
        mode: mode || DEFAULT_THEME_MODE,
      },
    })
  );

export default getTheme;
