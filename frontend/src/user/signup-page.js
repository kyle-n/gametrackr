import React from 'react';
import {Divider, Grid, Hidden} from '@material-ui/core';
import SignupFormContainer from './signup-form-container';
import {Link} from 'react-router-dom';

const SignupPage = props => (
  <Grid container>
    <Grid item xs={12}>
      <h2>Sign up for gametrackr</h2>
    </Grid>
    <Grid item xs={12} md={7}>
      <SignupFormContainer />
    </Grid>
    <Grid item xs={12} >
      <LoginMessage />
    </Grid>
  </Grid>
);

const LoginMessage = () => (
  <p>Already have an account? <Link to='/login' className="reset-color">Log in here</Link>.</p>
);

export default SignupPage;
