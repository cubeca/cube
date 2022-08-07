import { createTheme, responsiveFontSizes } from '@mui/material';

const DEFAULT_BORDER_RADIUS = 5;
const DEFAULT_FONT_SIZE = 16;
const FONT_FAMILY = ['Arimo'].join(',');
const DEFAULT_THEME_MODE = 'dark';

const THEME_COLORS = {
  primary: {
    main: '#5DE6FF'
  }
};

const getTheme = (mode?: 'dark' | 'light') =>
  responsiveFontSizes(
    createTheme({
      shape: {
        borderRadius: DEFAULT_BORDER_RADIUS
      },
      typography: {
        fontFamily: FONT_FAMILY,
        fontSize: DEFAULT_FONT_SIZE,
        body2: {
          padding: '1.5rem 0'
        }
      },
      palette: {
        mode: mode || DEFAULT_THEME_MODE,
        primary: {
          main: THEME_COLORS.primary.main
        }
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              textTransform: 'none',
              padding: '1rem 2rem'
            }
          }
        }
      }
    })
  );

export default getTheme;
