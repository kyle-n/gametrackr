import {NavLink} from 'react-router-dom';
import {ListItem, ListItemIcon, ListItemText} from '@material-ui/core';
import React from 'react';
import '../utils/layout.css';

export const NavLinkWithIcon = props => (
  <NavLink to={props.route.path} className="unstyled-link">
    <ListItem button>
      <ListItemIcon><props.route.icon /></ListItemIcon>
      <ListItemText>{props.route.title}</ListItemText>
    </ListItem>
  </NavLink>
);
