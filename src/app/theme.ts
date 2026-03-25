'use client';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#8ab4f8',
    },
    background: {
      default: '#1e1e2e',
      paper: '#1e1e2e',
    },
    text: {
      primary: '#e3e3e3',
      secondary: '#9aa0a6',
    },
  },
  typography: {
    fontFamily: '"Google Sans", "Roboto", sans-serif',
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#1e1e2e',
          margin: 0,
          padding: 0,
        },
        '*::-webkit-scrollbar': {
          width: '6px',
        },
        '*::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '*::-webkit-scrollbar-thumb': {
          background: '#444',
          borderRadius: '3px',
        },
      },
    },
  },
});

export default theme;
