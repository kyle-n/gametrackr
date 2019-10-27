import React from 'react';
import {
  Home as HomeIcon,
  List as ListIcon,
  Search as SearchIcon,
  Info as InfoIcon
} from '@material-ui/icons';

export const routes = {
  top: [
    {
      path: '/',
      title: 'gametrackr',
      icon: (<HomeIcon />),
      showOnlyWhenLoggedIn: false,
      exact: true
    },
    {
      path: '/about',
      title: 'about this website',
      icon: (<InfoIcon />),
      showOnlyWhenLoggedIn: false
    },
    {
      path: '/home',
      title: 'home',
      icon: (<HomeIcon />),
      showOnlyWhenLoggedIn: true,
    },
    {
      path: '/lists',
      title: 'lists',
      icon: (<ListIcon />),
      showOnlyWhenLoggedIn: true
    },
    {
      path: '/search',
      title: 'search',
      icon: (<SearchIcon />),
      showOnlyWhenLoggedIn: true
    }
  ]
};
