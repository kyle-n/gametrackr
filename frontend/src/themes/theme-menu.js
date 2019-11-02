import React from 'react';
import {Button, Menu, MenuItem} from '@material-ui/core';
import {Palette as PaletteIcon} from '@material-ui/icons';
import {themes} from './themes.model';

export default class ThemeMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {open: false};
  }

  componentDidMount() {
    this.anchorRef = document.getElementById('theme-picker');
  }

  themeClicked = (event, themeName) => {
    this.props.setTheme(themeName);
    this.toggleOpen(event);
  };

  toggleOpen = event => {
    this.setState({open: !this.state.open});
  };

  render() {
    const menuItems = Object.keys(themes).map(themeName => {
      return (
        <MenuItem key={themeName} onClick={event => this.themeClicked(event, themeName)}>
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
