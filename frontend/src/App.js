import React from 'react';
import './App.css';
import {BrowserRouter} from 'react-router-dom';
import {Container, CssBaseline} from '@material-ui/core';
import {connect} from 'react-redux';

import {RouteDisplay, routes} from './routing';
import {Title} from './nav';
import {ThemeDisplay} from './themes';
import {Footer} from './footer';

const App = props => {
  let allRoutes = [];
  Object.keys(routes).forEach(routeGroup => {
    allRoutes = allRoutes.concat(routes[routeGroup]);
  });

  return (
    <ThemeDisplay theme={props.theme}>
      <CssBaseline>
        <Container>
          <main>
            <BrowserRouter>
              <Title routes={routes.top} />
              <RouteDisplay routes={allRoutes} />
            </BrowserRouter>
          </main>
          <Footer />
        </Container>
      </CssBaseline>
    </ThemeDisplay>
  );
};

const mapStateToProps = state => {
  return {theme: state.theme};
};

export default connect(mapStateToProps)(App);
