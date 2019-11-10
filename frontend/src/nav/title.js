import React from 'react';
import {connect} from 'react-redux';
import '../utils/layout.css';
import {MobileNav} from './hamburger-menu';
import {NavLinkWithIcon} from './nav-link-with-icon';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import {Link} from 'react-router-dom';
import {ThemeMenu} from '../themes';
import {setTheme} from '../redux';

class Title extends React.Component {

  constructor(props) {
    super(props);
  }

  static getRoutesForLoginStatus = (routes, loggedIn) => {
    if (loggedIn) return routes.filter(route => route.showWhenLoggedIn);
    else return routes.filter(route => route.showWhenLoggedOut);
  };

  render() {
    const routes = Title.getRoutesForLoginStatus(this.props.routes, true);
    return (
      <Box component="header" mb="2rem" mt="1rem">
        <Grid container alignItems="center">
          <Hidden mdUp>
            <Grid item xs={1}>
              <MobileNav routes={routes}/>
            </Grid>
          </Hidden>
          <Grid item xs={7} md={4}>
            <SiteTitle loggedIn={this.props.loggedIn}/>
          </Grid>
          <Hidden mdUp>
            <Grid item xs={4} style={{textAlign: 'center'}}>
              <ThemeMenu setTheme={this.props.setTheme} />
            </Grid>
          </Hidden>
          <Hidden smDown>
            <Grid item md={6}>
              <DesktopNavLinks routes={routes}/>
            </Grid>
          </Hidden>
          <Hidden smDown>
            <Grid item md={2} style={{textAlign: 'left'}}>
              <ThemeMenu setTheme={this.props.setTheme} />
            </Grid>
          </Hidden>
        </Grid>
      </Box>
    );
  }
}

const SiteTitle = props => (
  <Link to={props.loggedIn ? '/home' : '/'} className="no-underline reset-color">
    <Typography variant="h4" variantMapping={{h4: 'h1'}}>gametrackr</Typography>
  </Link>
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
    if (route.alternateComponent) return (<route.alternateComponent key={route.path} route={route} desktop={true} />);
    return (<NavLinkWithIcon key={route.path} route={route} desktop={true} />);
  });
  return (<List style={horizontalListLayout}>{navLinks}</List>);
};

const mapStateToProps = state => {
  return {loggedIn: !!(state.userId && state.jwt)}
};

const dispatchMap = {setTheme};

export default connect(mapStateToProps, dispatchMap)(Title);
