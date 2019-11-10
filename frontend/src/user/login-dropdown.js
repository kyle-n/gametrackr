import React from 'react';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import LoginFormContainer from './login-form-container';

const LoginDropdown = props => (
  <Hidden smDown>
    <Grid container>
      <Grid item md={4}>
        <LoginFormContainer />
      </Grid>
    </Grid>
  </Hidden>
);

export default LoginDropdown;
