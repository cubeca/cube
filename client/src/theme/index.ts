import { createTheme, responsiveFontSizes } from '@mui/material';
import { alpha } from '@mui/material/styles';

const DEFAULT_BORDER_RADIUS = 5;
const DEFAULT_FONT_SIZE = 16;
const DEFAULT_SPACING = 8;
const FONT_FAMILY = ['Inter', 'sans-serif'].join(',');
const HEADING_FONT_FAMILY = ['Rubik', 'Inter', 'sans-serif'].join(',');
const DEFAULT_THEME_MODE = 'dark';

const THEME_COLORS = {
  primary: {
    main: '#95F5CB',
    light: '#D9FFEE',
    dark: '#57838B'
  },
  secondary: {
    main: '#28343C',
    light: '#D9FFEE',
    dark: '#57838B'
  },
  background: {
    default: '#28343C',
    paper: '#2F4048',
    light: '#3B545C',
    dark: '#1A1919'
  },
  error: {
    main: "#FFB7C4",
    dark: "#D13C4E"
  }
};

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    reversed: true;
  }
}

//*// primary dark and primary light are used by folks primary light and dark Settings. But I would like to set background color default here as well. Lance what do you think?//

const getTheme = (mode?: 'dark' | 'light') =>
  responsiveFontSizes(
    createTheme({
      spacing: DEFAULT_SPACING,
      shape: {
        borderRadius: DEFAULT_BORDER_RADIUS
      },
      typography: {
        fontFamily: FONT_FAMILY,
        fontWeightLight: 400,
        fontSize: DEFAULT_FONT_SIZE,
        h1: {
          fontFamily: HEADING_FONT_FAMILY,
          fontSize: '3.8rem',
          fontWeight: 400,
          color: THEME_COLORS.primary.main,
          marginTop: 32,
          marginBottom: 32
        },
        h2: {
          fontFamily: HEADING_FONT_FAMILY,
          fontSize: '3.5rem',
          color: THEME_COLORS.primary.main,
          marginTop: 32,
          marginBottom: 32
        },
        h3: {
          fontFamily: HEADING_FONT_FAMILY,
          fontSize: '2rem',
          color: THEME_COLORS.primary.main
        },
        
        h4: {
          fontFamily: HEADING_FONT_FAMILY,
          fontSize: '1.5rem',
          color: THEME_COLORS.primary.main
        },
        h5: {
          fontSize: '1.125rem',
          fontWeight: 700
        },
        h6: {
          fontSize: '1rem',
          fontWeight: 700
        },
        button: {
          fontSize: '1rem',
          fontWeight: 700
        },
        caption: {
          fontSize: '1rem'
        },
        overline: {
          fontSize: '1rem',
          fontWeight: 600
        },
        body1: {
          fontSize: '1.125rem',
          marginBottom: '32px'
        },
        body2: {
          fontSize: '1rem',
          margin: '10px, 0px, 10px',
        }
      },
      palette: {
        mode: mode || DEFAULT_THEME_MODE,
        primary: {
          main: THEME_COLORS.primary.main,
          light: THEME_COLORS.primary.light,
          dark: THEME_COLORS.primary.dark
        },
        secondary: {
          main: THEME_COLORS.secondary.main,
          light: THEME_COLORS.secondary.light,
          dark: THEME_COLORS.secondary.dark
        },
        background: {
          default: THEME_COLORS.background.default,
          paper: THEME_COLORS.background.paper
        },
        text: {
          primary: THEME_COLORS.primary.light,
          secondary: THEME_COLORS.primary.main,
          disabled: THEME_COLORS.primary.dark
        },
        error: {
          main: THEME_COLORS.error.main,
          dark: THEME_COLORS.error.dark
        },
        warning: {
          main: '#ffde33'
        },
        success: {
          main: THEME_COLORS.primary.main,
          light: THEME_COLORS.primary.light,
          dark: THEME_COLORS.primary.dark
        },
        info: {
          main: '#75b9f7'
        }
      },

      breakpoints: {
        values: {
          xs: 0,
          sm: 600,
          md: 1000,
          lg: 1400,
          xl: 1800
        }
      },

      components: {
        MuiCssBaseline: {
          styleOverrides: () => ({
            body: {
              margin: '0'
            }
          })
        },
        MuiButton: {
          variants: [
            {
              props: { variant: 'reversed' },
              style: {
                color: THEME_COLORS.primary.main,
                backgroundColor: THEME_COLORS.background.default,
                '&:hover': {
                  backgroundColor: THEME_COLORS.background.paper
                }
              }
            }
          ],
          styleOverrides: {
            root: {
              textTransform: 'none',
              padding: '1rem 2rem'
            }
          }
        },
        MuiIconButton: {
          styleOverrides: {
            sizeMedium: {
              color: alpha(THEME_COLORS.primary.light, 0.5)
            }
          }
        },
        MuiMenu: {
          styleOverrides: {
            paper: {
              backgroundColor: THEME_COLORS.background.paper
            }
          }
        }
      }
    })
  );

export default getTheme;
