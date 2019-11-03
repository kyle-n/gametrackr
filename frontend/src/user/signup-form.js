import React from 'react';
import {Button, Grid, TextField} from '@material-ui/core';
import FormGroup from '@material-ui/core/FormGroup'
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import {
  PersonAdd as SignupIcon,
} from '@material-ui/icons';
import {upperCaseFirstLetter} from '../utils';
import FormHelperText from '@material-ui/core/FormHelperText';

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
      {
        type: 'text',
        label: 'name',
        inputProps: {autoFocus: true},
        validator: val => val.length > 1 && val.length < 32
      },
      {
        type: 'password',
        label: 'password',
        inputProps: {},
        validator: val => val.length > 1 && val.length < 10000
      },
      {
        type: 'email',
        label: 'email',
        inputProps: {},
        validator: () => true
      }
    ];
  }

  updateFormControl = (key, value) => {
    this.setState({[key]: {value, valid: true}});
  };

  render() {
    const formControlMarkup = this.formControls.map(formControl => {
      const inputName = 'signup-' + formControl.label;
      return (
        <Grid key={formControl.label} item xs={10}>
          <FormControl fullWidth >
            <InputLabel htmlFor={inputName}>
              {upperCaseFirstLetter(formControl.label)}
            </InputLabel>
            <Input id={inputName} value={this.state[formControl.label].value} type={formControl.type}
                   onChange={event => this.updateFormControl(formControl.label, event.target.value)}
                   required inputProps={formControl.inputProps}
            />
          </FormControl>
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
