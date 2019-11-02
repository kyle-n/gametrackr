import {createMuiTheme} from '@material-ui/core';

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

export const themes = {dark, light};
