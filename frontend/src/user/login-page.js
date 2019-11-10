import React from 'react';
import Grid from '@material-ui/core/Grid';
import LoginFormContainer from './login-form-container';
import {PageTitle} from '../utils';

const LoginPage = props => (
  <Grid container>
    <Grid item xs={12}>
      <PageTitle title="Log in" />
    </Grid>
    <Grid item xs={12} md={6}>
      <LoginFormContainer />
    </Grid>
  </Grid>
);

export default LoginPage;
