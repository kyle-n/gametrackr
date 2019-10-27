import React from 'react';
import {Route, Switch} from 'react-router-dom';

export const RouteDisplay = props => {
  const routeMarkup = props.routes.map(route => {
    return (
      <Route key={route.path} exact={route.exact} path={route.path}>
        <p>{route.name}</p>
      </Route>
    );
  });

  return (
    <Switch>
      {routeMarkup}
    </Switch>
  );
};
