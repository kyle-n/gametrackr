import {NavLink} from 'react-router-dom';
import {ListItem, ListItemIcon, ListItemText} from '@material-ui/core';
import React from 'react';
import '../utils/layout.css';

export const NavLinkWithIcon = props => (
  <NavLink to={props.route.path} className="unstyled-link" onClick={props.route.fn ? props.route.fn : null}>
    <ListItem>
      <ListItemIcon style={{minWidth: props.desktop ? '33px' : '60px'}}><props.route.icon /></ListItemIcon>
      <ListItemText style={{marginRight: props.desktop ? '0' : '60px'}}>{props.route.title}</ListItemText>
    </ListItem>
  </NavLink>
);
