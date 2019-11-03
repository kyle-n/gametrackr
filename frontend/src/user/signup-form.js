import React from 'react';
import {Button, Grid, TextField} from '@material-ui/core';
import {
  PersonAdd as SignupIcon,
} from '@material-ui/icons';
import {upperCaseFirstLetter} from '../utils';

export class SignupForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      password: '',
      email: ''
    };
  }

  updateState = (key, value) => this.setState({[key]: value});

  render() {
    const formControls = [
      {type: 'text', label: 'name'},
      {type: 'password', label: 'password'},
      {type: 'email', label: 'email'}
    ].map(formControl => {
      return (
        <Grid key={formControl.label} item xs={12}>
          <TextField required type={formControl.type} value={this.state[formControl.label]}
                     id={'signup-' + formControl.label} label={upperCaseFirstLetter(formControl.label)} margin="normal"
                     onChange={event => this.updateState(formControl.label, event.target.value)}
          />
        </Grid>
      );
    });

    return (
      <form>
        <Grid container>
          {formControls}
          <Grid item xs={12}>
            <Button variant="contained" color="primary" startIcon={<SignupIcon />} size="large">
              Create account
            </Button>
          </Grid>
        </Grid>
      </form>
    );
  }
}
