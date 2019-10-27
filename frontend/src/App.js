import React from 'react';
import './App.css';
import {BrowserRouter} from 'react-router-dom';
import {CssBaseline} from '@material-ui/core';

import {RouteDisplay, routes} from './routing';
import {Title} from './nav';
import {Themes} from './themes';

function App() {
  let allRoutes = [];
  Object.keys(routes).forEach(routeGroup => {
    allRoutes = allRoutes.concat(routes[routeGroup]);
  });

  return (
    <Themes theme="dark">
      <CssBaseline>
        <main>
          <BrowserRouter>
            <Title routes={routes.top} loggedIn={true}/>
            <RouteDisplay routes={allRoutes} />
          </BrowserRouter>
        </main>
      </CssBaseline>
    </Themes>
  );
}

export default App;
