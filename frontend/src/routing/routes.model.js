import React from 'react';
import ListIcon from '@material-ui/icons/List'
import SearchIcon from '@material-ui/icons/Search';
import InfoIcon from '@material-ui/icons/Info';
import SignupIcon from '@material-ui/icons/PersonAdd';
import LoginIcon from '@material-ui/icons/ExitToApp';

import {SignupPage, LoginPage} from '../user';
import {SearchPage} from '../search';
import {GameDetailsPageContainer} from '../games';
import {DesktopLoginLink} from '../nav';
import {UserListsPage} from '../lists';

export const routes = {
  nav: [
    {
      path: '/signup',
      title: 'Sign up',
      icon: SignupIcon,
      showWhenLoggedIn: false,
      showWhenLoggedOut: true,
      component: SignupPage
    },
    {
      path: '/login',
      title: 'Log in',
      icon: LoginIcon,
      showWhenLoggedIn: false,
      showWhenLoggedOut: true,
      component: LoginPage,
      alternateComponent: DesktopLoginLink
    },
    {
      path: '/lists',
      title: 'Lists',
      icon: ListIcon,
      showWhenLoggedIn: true,
      showWhenLoggedOut: false,
      component: UserListsPage
    },
    {
      path: '/search',
      title: 'Search',
      icon: SearchIcon,
      showWhenLoggedIn: true,
      showWhenLoggedOut: false,
      component: SearchPage
    },
    {
      path: '/about',
      title: 'About',
      icon: InfoIcon,
      showWhenLoggedIn: true,
      showWhenLoggedOut: true,
      component: SignupPage
    }
  ],
  games: [
    {
      path: '/games/:id/details',
      showWhenLoggedIn: true,
      showWhenLoggedOut: true,
      component: GameDetailsPageContainer
    }
  ]
};
