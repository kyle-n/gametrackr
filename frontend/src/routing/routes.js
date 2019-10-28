import React from 'react';
import {
  Home as HomeIcon,
  List as ListIcon,
  Search as SearchIcon,
  Info as InfoIcon,
  PersonAdd as SignupIcon,
  ExitToApp as LoginIcon
} from '@material-ui/icons';

export const routes = {
  top: [
    {
      path: '/signup',
      title: 'Sign up',
      icon: SignupIcon,
      showWhenLoggedIn: false,
      showWhenLoggedOut: true
    },
    {
      path: '/login',
      title: 'Log in',
      icon: LoginIcon,
      showWhenLoggedIn: false,
      showWhenLoggedOut: true
    },
    {
      path: '/lists',
      title: 'Lists',
      icon: ListIcon,
      showWhenLoggedIn: true,
      showWhenLoggedOut: false
    },
    {
      path: '/search',
      title: 'Search',
      icon: SearchIcon,
      showWhenLoggedIn: true,
      showWhenLoggedOut: false
    },
    {
      path: '/about',
      title: 'About',
      icon: InfoIcon,
      showWhenLoggedIn: true,
      showWhenLoggedOut: true
    }
  ]
};
