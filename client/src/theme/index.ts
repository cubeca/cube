import { Settings } from '@mui/icons-material';
import { createTheme, responsiveFontSizes } from '@mui/material';

const DEFAULT_BORDER_RADIUS = 5;
const DEFAULT_FONT_SIZE = 16;
const FONT_FAMILY = ['Inter'].join(',');
const DEFAULT_THEME_MODE = 'dark';

const THEME_COLORS = {
  primary: {
    main: '#95F5CB',
    light: '#D9FFEE',
    dark: '#57838b',
  },
  background: {
    default: '#28343C',
    paper: '#2f4048',
  }
};
//*// primary dark and primary light are used by folks primary light and dark Settings. But I would like to set background color default here as well. Lance what do you think?//

const getTheme = (mode?: 'dark' | 'light') =>
  responsiveFontSizes(
    createTheme({
      shape: {
        borderRadius: DEFAULT_BORDER_RADIUS
      },
      typography: {
        fontFamily: FONT_FAMILY,
        fontWeightLight: 400,
        fontSize: DEFAULT_FONT_SIZE,
        h1: {
          fontFamily: 'Rubik',
          fontSize: '3.8rem',
          fontWeight: 400,
          color: THEME_COLORS.primary.main,
        },
        h2: {
          fontFamily: 'Rubik',
          fontSize: '3.5rem',
          color: THEME_COLORS.primary.main,
        },
        h3: {
          fontFamily: 'Rubik',
          fontSize: '2rem',
          color: THEME_COLORS.primary.main,
        },
        h4: {
          fontFamily: 'Rubik',
          fontSize: '1.5rem',
          color: THEME_COLORS.primary.main,
        },
        h5: {
          fontSize: '1.125rem',
          fontWeight: 700,
        },
        h6: {
          fontSize: '1rem',
          fontWeight: 700,
        },
        button: {
          fontSize: '1rem',
          fontWeight: 700,
        },
        caption: {
          fontSize: '1rem',
        },
        overline: {
          fontSize: '1rem',
          fontWeight: 600,
        },
        body1: {
          fontSize: '1.125rem',
          margin: '1.875rem 0'
        },
        body2: {
          fontSize: '1rem',
          margin: '1.875rem 0'
        }
      },
      palette: {
        mode: mode || DEFAULT_THEME_MODE,
        primary: {
          main: THEME_COLORS.primary.main,
          light: THEME_COLORS.primary.light,
          dark: THEME_COLORS.primary.dark,
        },
        secondary: {
          main: THEME_COLORS.primary.main,
          light: THEME_COLORS.primary.light,
          dark: THEME_COLORS.primary.dark,
        },
        background: {
          default: THEME_COLORS.background.default,
          paper: THEME_COLORS.background.paper,
        },
        text: {
          primary: THEME_COLORS.primary.light,
          secondary: THEME_COLORS.primary.main,
          disabled: THEME_COLORS.primary.dark,
        },
        error: {
          main: '#c01534',
        },
        warning: {
          main: '#ffde33',
        },
        success: {
          main: THEME_COLORS.primary.main,
          light: THEME_COLORS.primary.light,
          dark: THEME_COLORS.primary.dark,
        },
        info: {
          main: '#75b9f7',
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
