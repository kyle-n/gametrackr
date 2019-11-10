import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import UserFormContainer from './user-form-container';
import {Link} from 'react-router-dom';
import {PageTitle} from '../utils';

const SignupPage = props => (
  <Grid container>
    <Grid item xs={12}>
      <PageTitle title="Sign up"/>
    </Grid>
    <Grid item xs={12} md={7}>
      <UserFormContainer />
    </Grid>
    <Grid item xs={12} >
      <LoginMessage />
    </Grid>
  </Grid>
);

const LoginMessage = () => (
  <Typography variant="body1">Already have an account? <Link to='/login' className="reset-color">Log in here</Link>.</Typography>
);

export default SignupPage;
