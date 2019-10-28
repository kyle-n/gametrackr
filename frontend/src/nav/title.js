import React from 'react';
import '../utils/layout.css';
import {MobileNav} from './hamburger-menu';
import {Grid, Hidden} from '@material-ui/core';
import {NavLinkWithIcon} from './nav-link-with-icon';
import List from '@material-ui/core/List';

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
        <Hidden mdUp>
          <Grid item xs={1}>
            <MobileNav routes={routes}/>
          </Grid>
        </Hidden>
        <Grid item xs={11} md={4}>
          <SiteTitle/>
        </Grid>
        <Hidden smDown>
          <Grid item md={8}>
            <DesktopNavLinks routes={routes}/>
          </Grid>
        </Hidden>
      </Grid>
    );
  }
}

const SiteTitle = () => (
  <header style={{textAlign: 'center'}}>
    <h1>gametrackr</h1>
  </header>
);

const DesktopNavLinks = props => {
  const horizontalListLayout = {
    display: 'flex',
    flexDirection: 'row',
    padding: 0,
    textAlign: 'right',
    justifyContent: 'flex-end'
  };
  const navLinks = props.routes.map(route => {
    return (<NavLinkWithIcon key={route.path} route={route} desktop={true} />);
  });
  return (<List style={horizontalListLayout}>{navLinks}</List>);
};
