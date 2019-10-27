import React from 'react';
import {Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText} from '@material-ui/core';
import {
  Menu as MenuIcon,
} from '@material-ui/icons';
import {NavLink} from 'react-router-dom';
import '../utils/layout.css';

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
      <SideDrawerLink key={route.path} route={route}/>
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

const SideDrawerLink = props => (
  <NavLink to={props.route.path} className="unstyled-link">
    <ListItem button>
      <ListItemIcon><props.route.icon /></ListItemIcon>
      <ListItemText>{props.route.title}</ListItemText>
    </ListItem>
  </NavLink>
);

const DrawerButton = props => (
  <IconButton onClick={props.toggleDrawer}>
    <MenuIcon />
  </IconButton>
);
