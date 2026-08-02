import { alpha, createTheme } from '@mui/material/styles';

// The @font-face rules come from the @fontsource/jetbrains-mono weight import in src/main.tsx, which
// loads weight 500 only -- anything rendered in this stack must stay at that weight or be synthesized.
export const MONO_FONT_FAMILY = '"JetBrains Mono", Consolas, Monaco, "Ubuntu Mono", monospace';

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
    // Chrome on Windows paints the OS scrollbar in its light default, which reads as a bright seam
    // between the drawer and the canvas. `color-scheme` is what actually re-themes the scrollbar in
    // current Chrome and Safari; the explicit colors below tone the thumb down further and cover
    // engines that ignore it. Both syntaxes are declared on purpose: Chrome 121+ and Firefox honour
    // the standard `scrollbar-*` properties (and let them win over the pseudo-elements), while older
    // Chrome and Safari only understand `::-webkit-scrollbar`.
    MuiCssBaseline: {
      styleOverrides: (theme) => ({
        ':root': {
          colorScheme: 'dark',
        },
        '*': {
          scrollbarWidth: 'thin',
          scrollbarColor: `${theme.palette.grey[800]} transparent`,
        },
        '*::-webkit-scrollbar': {
          width: 8,
          height: 8,
        },
        '*::-webkit-scrollbar-track, *::-webkit-scrollbar-corner': {
          backgroundColor: 'transparent',
        },
        '*::-webkit-scrollbar-thumb': {
          backgroundColor: theme.palette.grey[800],
          borderRadius: 4,
        },
        '*::-webkit-scrollbar-thumb:hover': {
          backgroundColor: theme.palette.grey[700],
        },
      }),
    },
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
