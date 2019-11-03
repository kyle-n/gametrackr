import React from 'react';
import {Route, Switch} from 'react-router-dom';

export const RouteDisplay = props => {
  const routeMarkup = props.routes.map(route => {
    return (
      <Route key={route.path} exact={route.exact} path={route.path}>
        <route.component />
      </Route>
    );
  });

  return (
    <Switch>
      {routeMarkup}
    </Switch>
  );
};
