import React from 'react';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LoginFormContainer from './login-form-container';
import {PageTitle} from '../utils';

const LoginPage = props => (
  <Grid container>
    <Grid item xs={12}>
      <PageTitle title="Log in" />
    </Grid>
    <Grid item xs={12} md={6}>
      <Box mt="2rem">
        <LoginFormContainer />
      </Box>
    </Grid>
  </Grid>
);

export default LoginPage;
