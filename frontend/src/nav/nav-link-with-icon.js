import {NavLink} from 'react-router-dom';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import React from 'react';
import '../utils/layout.css';

export const NavLinkWithIcon = props => (
  <NavLink to={props.route.path} className="no-underline reset-color" onClick={props.route.fn ? props.route.fn : null}>
    <ListItem>
      <ListItemIcon style={{minWidth: props.desktop ? '33px' : '60px'}}><props.route.icon /></ListItemIcon>
      <ListItemText style={{marginRight: props.desktop ? '0' : '60px'}}>{props.route.title}</ListItemText>
    </ListItem>
  </NavLink>
);
