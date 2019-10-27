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
      path: '/',
      title: 'GameTrackr',
      icon: HomeIcon,
      showOnlyWhenLoggedIn: false,
      exact: true
    },
    {
      path: '/signup',
      title: 'Sign up',
      icon: SignupIcon,
      showOnlyWhenLoggedIn: false
    },
    {
      path: '/login',
      title: 'Log in',
      icon: LoginIcon,
      showOnlyWhenLoggedIn: false
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
