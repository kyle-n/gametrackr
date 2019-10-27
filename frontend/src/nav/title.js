import React from 'react';
import '../utils/layout.css';
import {MobileNav} from './hamburger-menu';

export class Title extends React.Component {

  constructor(props) {
    super(props);
    this.routes = Title.getRoutesForLoginStatus(props.routes, props.loggedIn);
  }

  static getRoutesForLoginStatus = (routes, loggedIn) => {
    return routes.filter(route => route.showOnlyWhenLoggedIn === loggedIn);
  };

  render() {
    return (
      <header>
        <h1>gametrackr</h1>
        <MobileNav routes={this.routes} />
      </header>
    );
  }
}
