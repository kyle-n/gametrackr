import React from 'react';
import {Drawer, Hidden, IconButton, List} from '@material-ui/core';
import {
  Menu as MenuIcon,
} from '@material-ui/icons';
import {NavLinkWithIcon} from './nav-link-with-icon';

export class MobileNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {open: false}
  }

  toggleDrawer = () => this.setState({open: !this.state.open});

  render() {
    return (
      <div onClick={this.toggleDrawer}>
        <DrawerButton toggleDrawer={this.toggleDrawer}/>
        <SideDrawerContainer
          open={this.state.open}
          routes={this.props.routes}
        />
      </div>
    );
  }
}

const SideDrawerContainer = props => {
  const navLinks = props.routes.map(route => {
    return (
      <Hidden key={route.path} mdDown={route.title === 'Theme'}>
        <NavLinkWithIcon route={route}/>
      </Hidden>
    );
  });
  return (
    <Drawer anchor="left" open={props.open}>
      <List>
        {navLinks}
      </List>
    </Drawer>
  );
};

const DrawerButton = props => (
  <IconButton onClick={props.toggleDrawer}>
    <MenuIcon />
  </IconButton>
);
