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

// Focus visible outline color - ensures good contrast for keyboard navigation
const FOCUS_VISIBLE_OUTLINE = `2px solid ${THEME_COLORS.primary.main}`;

// Common interactive states for better accessibility
const INTERACTIVE_STATES = {
  hover: {
    transform: 'translateY(-1px)',
    boxShadow: `0 2px 4px ${alpha(THEME_COLORS.primary.main, 0.2)}`
  },
  active: {
    transform: 'translateY(0)',
    boxShadow: 'none'
  },
  focusVisible: {
    outline: FOCUS_VISIBLE_OUTLINE,
    outlineOffset: '2px'
  }
};

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    reversed: true;
  }
}

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
            },
            // Global focus styles for better accessibility
            '*:focus-visible': {
              ...INTERACTIVE_STATES.focusVisible
            },
            // Global link styles for better accessibility
            'a': {
              color: THEME_COLORS.primary.main,
              textDecoration: 'none',
              position: 'relative',
              transition: 'all 0.2s ease-in-out',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: '-2px',
                left: 0,
                width: '0%',
                height: '2px',
                backgroundColor: alpha(THEME_COLORS.primary.light, 0.7),
                transition: 'width 0.2s ease-in-out'
              },
              '&:hover': {
                color: THEME_COLORS.primary.light,
                '&::after': {
                  width: '100%'
                }
              },
              '&:active': {
                color: THEME_COLORS.primary.dark,
                '&::after': {
                  backgroundColor: THEME_COLORS.primary.dark
                }
              },
              '&:focus-visible': {
                ...INTERACTIVE_STATES.focusVisible
              }
            },
            // Enhanced styles for navigation links
            'a.nav-link': {
              color: alpha(THEME_COLORS.primary.light, 0.7),
              textDecoration: 'none',
              position: 'relative',
              transition: 'all 0.2s ease-in-out',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: '-2px',
                left: 0,
                width: '0%',
                height: '2px',
                backgroundColor: THEME_COLORS.primary.main,
                transition: 'width 0.2s ease-in-out'
              },
              '&:hover': {
                color: THEME_COLORS.primary.main,
                '&::after': {
                  width: '100%'
                }
              },
              '&:active': {
                color: THEME_COLORS.primary.dark,
                transform: 'scale(0.98)'
              },
              '&:focus-visible': {
                ...INTERACTIVE_STATES.focusVisible
              },
              '&.active': {
                color: THEME_COLORS.primary.main,
                fontWeight: 600,
                '&::after': {
                  width: '100%'
                }
              }
            },
            // Enhanced styles for content thumbnails
            '.content-thumbnail': {
              position: 'relative',
              transition: 'all 0.2s ease-in-out',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                border: `2px solid transparent`,
                borderRadius: DEFAULT_BORDER_RADIUS,
                transition: 'all 0.2s ease-in-out',
                zIndex: 1
              },
              '&:hover': {
                transform: 'translateY(-2px)',
                '&::before': {
                  border: `2px solid ${alpha(THEME_COLORS.primary.main, 0.7)}`,
                  boxShadow: `0 4px 8px ${alpha(THEME_COLORS.primary.main, 0.2)}`
                }
              },
              '&:active': {
                transform: 'translateY(0)',
                '&::before': {
                  borderColor: THEME_COLORS.primary.main
                }
              },
              '&:focus-visible': {
                ...INTERACTIVE_STATES.focusVisible
              }
            },
            // Enhanced styles for media player controls
            '.react-player__controls': {
              backgroundColor: alpha(THEME_COLORS.background.dark, 0.8),
              padding: '8px',
              borderRadius: DEFAULT_BORDER_RADIUS,
              '& button': {
                color: alpha(THEME_COLORS.primary.light, 0.7),
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  color: THEME_COLORS.primary.main,
                  transform: 'scale(1.1)'
                },
                '&:active': {
                  transform: 'scale(0.95)'
                },
                '&:focus-visible': {
                  ...INTERACTIVE_STATES.focusVisible
                }
              },
              '& .react-player__progress': {
                backgroundColor: alpha(THEME_COLORS.primary.main, 0.3),
                '&:hover': {
                  height: '8px'
                },
                '& > div': {
                  backgroundColor: THEME_COLORS.primary.main
                }
              }
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
                border: `1px solid ${alpha(THEME_COLORS.primary.main, 0.5)}`,
                '&:hover': {
                  backgroundColor: THEME_COLORS.background.paper,
                  borderColor: THEME_COLORS.primary.main,
                  ...INTERACTIVE_STATES.hover
                },
                '&:active': INTERACTIVE_STATES.active,
                '&:focus-visible': INTERACTIVE_STATES.focusVisible
              }
            }
          ],
          styleOverrides: {
            root: {
              textTransform: 'none',
              padding: '1rem 2rem',
              position: 'relative',
              '&:hover': INTERACTIVE_STATES.hover,
              '&:active': INTERACTIVE_STATES.active,
              '&:focus-visible': INTERACTIVE_STATES.focusVisible,
              '&.Mui-disabled': {
                backgroundColor: alpha(THEME_COLORS.background.light, 0.5),
                color: alpha(THEME_COLORS.primary.main, 0.5),
                cursor: 'not-allowed'
              }
            }
          }
        },
        MuiIconButton: {
          styleOverrides: {
            root: {
              color: alpha(THEME_COLORS.primary.light, 0.7),
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                color: THEME_COLORS.primary.main,
                backgroundColor: alpha(THEME_COLORS.primary.main, 0.1),
                transform: 'scale(1.1)'
              },
              '&:active': {
                transform: 'scale(0.95)'
              },
              '&:focus-visible': INTERACTIVE_STATES.focusVisible,
              '&.Mui-disabled': {
                color: alpha(THEME_COLORS.primary.main, 0.3)
              }
            },
            sizeMedium: {
              color: alpha(THEME_COLORS.primary.light, 0.7)
            }
          }
        },
       MuiTextField: {
          styleOverrides: {
            root: {
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'transparent',
                transition: 'all 0.2s ease-in-out',
                '& fieldset': {
                  borderColor: alpha(THEME_COLORS.primary.main, 0.3),
                  transition: 'all 0.2s ease-in-out'
                },
                '&:hover': {
                  backgroundColor: alpha(THEME_COLORS.background.light, 0.2),
                  '& fieldset': {
                    borderColor: alpha(THEME_COLORS.primary.main, 0.5),
                    borderWidth: '2px'
                  }
                },
                '&.Mui-focused': {
                  backgroundColor: alpha(THEME_COLORS.background.light, 0.3),
                  '& fieldset': {
                    borderColor: THEME_COLORS.primary.main,
                    borderWidth: '2px'
                  }
                }
              }
            } 
          }
        },
        MuiInputBase: {
          styleOverrides: {
            root: {
              backgroundColor: 'transparent',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: alpha(THEME_COLORS.background.light, 0.2)
              },
              '&.Mui-focused': {
                backgroundColor: alpha(THEME_COLORS.background.light, 0.3)
              },
              '& input::placeholder': {
                color: THEME_COLORS.primary.dark,
                opacity: 1
              }
            }
          }
        },
        MuiLink: {
          styleOverrides: {
            root: {
              color: THEME_COLORS.primary.main,
              textDecoration: 'none',
              position: 'relative',
              transition: 'all 0.2s ease-in-out',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: '-2px',
                left: 0,
                width: '0%',
                height: '2px',
                backgroundColor: alpha(THEME_COLORS.primary.light, 0.7),
                transition: 'width 0.2s ease-in-out'
              },
              '&:hover': {
                color: THEME_COLORS.primary.light,
                '&::after': {
                  width: '100%'
                }
              },
              '&:active': {
                color: THEME_COLORS.primary.dark,
                '&::after': {
                  backgroundColor: THEME_COLORS.primary.dark
                }
              },
              '&:focus-visible': {
                ...INTERACTIVE_STATES.focusVisible
              }
            }
          }
        },
        MuiMenu: {
          styleOverrides: {
            paper: {
              backgroundColor: THEME_COLORS.background.paper,
              border: `1px solid ${alpha(THEME_COLORS.primary.main, 0.1)}`,
              '& .MuiMenuItem-root': {
                '&:hover': {
                  backgroundColor: alpha(THEME_COLORS.primary.main, 0.1)
                },
                '&.Mui-selected': {
                  backgroundColor: alpha(THEME_COLORS.primary.main, 0.2),
                  '&:hover': {
                    backgroundColor: alpha(THEME_COLORS.primary.main, 0.3)
                  }
                },
                '&:focus-visible': INTERACTIVE_STATES.focusVisible
              }
            }
          }
        }
      }
    })
  );

export default getTheme;
