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
      title: 'GameTrackr',
      icon: HomeIcon,
      showOnlyWhenLoggedIn: false,
      exact: true
    },
    {
      path: '/about',
      title: 'About',
      icon: InfoIcon,
      showOnlyWhenLoggedIn: false
    },
    {
      path: '/home',
      title: 'Home',
      icon: HomeIcon,
      showOnlyWhenLoggedIn: true
    },
    {
      path: '/lists',
      title: 'Lists',
      icon: ListIcon,
      showOnlyWhenLoggedIn: true
    },
    {
      path: '/search',
      title: 'Search',
      icon: SearchIcon,
      showOnlyWhenLoggedIn: true
    }
  ]
};
