import { ThemeProvider } from '@mui/material/styles';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { themeOptions } from './utils/theme';

const root = ReactDOM.createRoot(document.getElementById('app') as HTMLElement);
root.render(
  <React.StrictMode>
    <ThemeProvider theme={themeOptions}>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
