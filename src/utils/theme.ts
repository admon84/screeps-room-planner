import { alpha, createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    // The @font-face rules come from the @fontsource/inter weight imports in src/main.tsx.
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
  },
  palette: {
    mode: 'dark',
    primary: {
      main: '#3b9eff',
      contrastText: '#04101f',
      light: '#7cc2ff',
      dark: '#1d6fd0',
    },
    secondary: {
      main: '#202020',
      light: '#2e2e2e',
      contrastText: '#ededed',
      dark: '#0d0d0d',
    },
    divider: '#2e2e2e',
    text: {
      primary: '#ededed',
      secondary: '#a1a1a1',
      disabled: '#5f5f5f',
    },
    background: {
      default: '#0d0d0d',
      paper: '#171717',
    },
    error: {
      main: '#f87171',
      light: '#fca5a5',
      dark: '#dc2626',
    },
    warning: {
      main: '#fbbf24',
      light: '#fcd34d',
      dark: '#d97706',
    },
    info: {
      main: '#22d3ee',
      light: '#67e8f9',
      dark: '#0891b2',
    },
    success: {
      main: '#4ade80',
      light: '#86efac',
      dark: '#16a34a',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: ({ theme }) => ({
          background: theme.palette.background.paper,
          borderBottom: `1px solid ${theme.palette.divider}`,
          boxShadow: 'none',
        }),
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: ({ theme }) => ({
          backgroundColor: theme.palette.background.paper,
          borderRight: `1px solid ${theme.palette.divider}`,
        }),
      },
    },
    MuiToolbar: {
      styleOverrides: {
        // MUI widens its gutters to spacing(3) from the `sm` breakpoint up, which leaves the app bar
        // indented further than the drawer rows at spacing(2). Pinned so both edges line up.
        gutters: ({ theme }) => ({
          [theme.breakpoints.up('sm')]: {
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),
          },
        }),
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 6,
          letterSpacing: 0,
          textTransform: 'none',
        },
        contained: ({ theme, ownerState }) =>
          ownerState.color === 'primary' || ownerState.color === undefined
            ? { ':hover': { backgroundColor: theme.palette.primary.light } }
            : {},
        // A bare outlined button reads as unstyled default, and a fully saturated border is as
        // loud as a fill. A dimmed border over a faint tint keeps them quiet but deliberate.
        outlined: ({ theme, ownerState }) =>
          ownerState.color === 'primary' || ownerState.color === undefined
            ? {
                backgroundColor: alpha(theme.palette.primary.main, 0.06),
                borderColor: alpha(theme.palette.primary.main, 0.35),
                color: theme.palette.primary.light,
                ':hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.14),
                  borderColor: theme.palette.primary.main,
                },
              }
            : {},
      },
    },
  },
});

export default theme;
