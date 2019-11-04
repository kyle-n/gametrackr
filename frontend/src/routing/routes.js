import React from 'react';
import {
  List as ListIcon,
  Search as SearchIcon,
  Info as InfoIcon,
  PersonAdd as SignupIcon,
  ExitToApp as LoginIcon
} from '@material-ui/icons';

import {UserFormPage} from '../user';

export const routes = {
  top: [
    {
      path: '/signup',
      title: 'Sign up',
      icon: SignupIcon,
      showWhenLoggedIn: false,
      showWhenLoggedOut: true,
      component: UserFormPage
    },
    {
      path: '/login',
      title: 'Log in',
      icon: LoginIcon,
      showWhenLoggedIn: false,
      showWhenLoggedOut: true,
      component: UserFormPage
    },
    {
      path: '/lists',
      title: 'Lists',
      icon: ListIcon,
      showWhenLoggedIn: true,
      showWhenLoggedOut: false,
      component: UserFormPage
    },
    {
      path: '/search',
      title: 'Search',
      icon: SearchIcon,
      showWhenLoggedIn: true,
      showWhenLoggedOut: false,
      component: UserFormPage
    },
    {
      path: '/about',
      title: 'About',
      icon: InfoIcon,
      showWhenLoggedIn: true,
      showWhenLoggedOut: true,
      component: UserFormPage
    }
  ]
};
