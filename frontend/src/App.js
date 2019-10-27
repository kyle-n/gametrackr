import React from 'react';
import './App.css';
import {BrowserRouter, } from 'react-router-dom';
import {RouteDisplay, routes} from './routing';

import {Title} from './nav';

function App() {
  let allRoutes = [];
  Object.keys(routes).forEach(routeGroup => {
    allRoutes = allRoutes.concat(routes[routeGroup]);
  });

  return (
    <main>
      <BrowserRouter>
        <Title routes={routes.top} />
        <RouteDisplay routes={allRoutes} />
      </BrowserRouter>
    </main>
  );
}

export default App;
