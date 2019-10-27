import React from 'react';
import '../utils/layout.css';
import {MobileNav} from './hamburger-menu';

export class Title extends React.Component {

  constructor(props) {
    super(props);
  }

  static getRoutesForLoginStatus = (routes, loggedIn) => {
    return routes.filter(route => route.showOnlyWhenLoggedIn === loggedIn);
  };

  render() {
    const routes = Title.getRoutesForLoginStatus(this.props.routes, this.props.loggedIn);
    return (
      <header>
        <h1>gametrackr</h1>
        <MobileNav routes={routes} />
      </header>
    );
  }
}
