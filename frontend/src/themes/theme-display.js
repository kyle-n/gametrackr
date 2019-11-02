import React from 'react';
import {ThemeProvider} from '@material-ui/styles';
import {themes} from './themes.model';

const ThemeDisplay = props => (
  <ThemeProvider theme={themes[props.theme]}>
    {props.children}
  </ThemeProvider>
);

export default ThemeDisplay;
