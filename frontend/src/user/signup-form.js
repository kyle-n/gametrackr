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
      name: {value: '', valid: true},
      password: {value: '', valid: true},
      email: {value: '', valid: true},
      valid: false
    };
    this.formControls = [
      {type: 'text', label: 'name'},
      {type: 'password', label: 'password'},
      {type: 'email', label: 'email'}
    ];
  }

  updateState = (key, value) => {
    this.setState({[key]: value});
  };

  render() {
    const formControlMarkup = this.formControls.map(formControl => {
      console.log(this.state)
      return (
        <Grid key={formControl.label} item xs={12}>
          <TextField required type={formControl.type} value={this.state[formControl.label].value} fullWidth
                     id={'signup-' + formControl.label} label={upperCaseFirstLetter(formControl.label)} margin="normal"
                     onChange={event => this.updateState(formControl.label, event.target.value)}
                     error={!this.state[formControl.label].valid}
          />
        </Grid>
      );
    });

    return (
      <form>
        <Grid container>
          {formControlMarkup}
          <Grid item xs={12} style={{marginTop: '1rem'}}>
            <Button variant="contained" color="primary" startIcon={<SignupIcon />} size="large"
                    disabled={!this.state.valid}
            >
              Create account
            </Button>
          </Grid>
        </Grid>
      </form>
    );
  }
}
