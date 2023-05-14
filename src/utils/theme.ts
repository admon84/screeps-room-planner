import { createTheme } from '@mui/material';

export const themeOptions = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#5973ff',
      contrastText: '#111',
      light: '#94a1ff',
      dark: '#0048cb',
    },
    secondary: {
      main: '#191a1e',
      light: '#3f4045',
      contrastText: 'rgba(236,239,255,0.8)',
      dark: '#0a0a0a',
    },
    divider: '#333',
    text: {
      primary: '#ccc',
      secondary: '#999',
      disabled: '#666',
    },
    background: {
      default: 'rgba(0,0,0,0.87)',
      paper: '#222',
    },
    error: {
      main: '#ff6d00',
      light: '#ff9e40',
      dark: '#c43c00',
    },
    warning: {
      main: '#ffe56d',
      light: '#ffff9e',
      dark: '#c9b33c',
    },
    info: {
      main: '#3f53b5',
      light: '#757fe8',
      dark: '#002b84',
    },
    success: {
      main: '#65fd62',
      light: '#9fff94',
      dark: '#16c92f',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: '#191a1e',
        },
      },
    },
  },
});
