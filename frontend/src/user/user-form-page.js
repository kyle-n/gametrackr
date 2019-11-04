import React from 'react';
import Grid from '@material-ui/core/Grid';
import UserFormContainer from './user-form-container';
import {Link} from 'react-router-dom';

const UserFormPage = props => (
  <Grid container>
    <Grid item xs={12}>
      <h2>Sign up for gametrackr</h2>
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
  <p>Already have an account? <Link to='/login' className="reset-color">Log in here</Link>.</p>
);

export default UserFormPage;
