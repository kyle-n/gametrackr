import React from 'react';
import {createMuiTheme, ThemeProvider} from '@material-ui/core/styles';

const dark = createMuiTheme({
  palette: {
    type: 'dark',
  }
});

const light = createMuiTheme({
  palette: {
    type: 'light'
  }
});

const themes = {dark, light};

export const Themes = props => (
  <ThemeProvider theme={themes[props.theme]}>
    {props.children}
  </ThemeProvider>
);
