import React from 'react';
import {createMuiTheme, ThemeProvider} from '@material-ui/core/styles';
import {Button, Menu, MenuItem} from '@material-ui/core';
import {Palette as PaletteIcon} from '@material-ui/icons';

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

export class ThemeMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {open: false};
  }

  toggleOpen = event => {
    this.anchorRef = event.target;
    this.setState({open: !this.state.open});
  };

  render() {
    const menuItems = Object.keys(themes).map(themeName => {
      return (
        <MenuItem key={themeName} onClick={() => this.props.setTheme(themes[themeName])}>
          {themeName}
        </MenuItem>
      );
    });
    return (
      <div>
        <Button variant="outlined" onClick={this.toggleOpen}>
          <PaletteIcon />
          Theme
        </Button>
        <Menu open={this.state.open} anchorEl={this.anchorRef} onClose={this.toggleOpen}>
          {menuItems}
        </Menu>
      </div>
    );
  }

}
