import React from 'react';
import {createMuiTheme, ThemeProvider} from '@material-ui/core/styles';
import {Button, Menu, MenuItem} from '@material-ui/core';
import {Palette as PaletteIcon} from '@material-ui/icons';
import './utils/layout.css';

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

  componentDidMount() {
    this.anchorRef = document.getElementById('theme-picker');
  }

  toggleOpen = event => {
    // this.anchorRef = event.target;
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
      <div id="theme-picker">
        <Button variant="outlined" onClick={this.toggleOpen}>
          <PaletteIcon />
          <span style={{marginLeft: '0.5rem'}}>Theme</span>
        </Button>
        <Menu open={this.state.open} anchorEl={this.anchorRef} onClose={this.toggleOpen}
              transformOrigin={{vertical: 'top', horizontal: 'right'}}
              anchorOrigin={{horizontal: 'center', vertical: 'bottom'}}
              getContentAnchorEl={null}
        >
          {menuItems}
        </Menu>
      </div>
    );
  }

}
