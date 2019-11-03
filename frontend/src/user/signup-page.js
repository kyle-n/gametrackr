import React from 'react';
import {Grid} from '@material-ui/core';
import SignupFormContainer from './signup-form-container';

const SignupPage = props => (
  <Grid container>
    <Grid item xs={12}>
      <h2>Sign up for gametrackr</h2>
    </Grid>
    <Grid item xs={12} md={8}>
      <SignupFormContainer />
    </Grid>
    <Grid item xs={12} md={4}>
      <p>Or log in</p>
    </Grid>
  </Grid>
);

export default SignupPage;
