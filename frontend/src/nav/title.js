import React from 'react';
import '../utils/layout.css';
import {MobileNav} from './hamburger-menu';
import {Grid, Hidden} from '@material-ui/core';

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
      <Grid container alignItems="center">
        <Grid item xs={1}>
          <MobileNav routes={routes}/>
        </Grid>
        <Grid item xs={11}>
          <SiteTitle/>
        </Grid>
      </Grid>
    );
  }
}

const SiteTitle = () => (
  <header style={{textAlign: 'center'}}>
    <h1>gametrackr</h1>
  </header>
);
