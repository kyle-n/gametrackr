import React from 'react';
import {Button, Grid, TextField} from '@material-ui/core';
import FormGroup from '@material-ui/core/FormGroup'
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import {
  PersonAdd as SignupIcon,
} from '@material-ui/icons';
import {isEmail, upperCaseFirstLetter} from '../utils';

export class SignupForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: {
        type: 'text',
        label: 'name',
        inputProps: {autoFocus: true},
        valid: true,
        validator: val => val.length > 0 && val.length <= 32
      },
      password: {
        type: 'password',
        label: 'password',
        inputProps: {},
        valid: true,
        validator: val => val.length > 0 && val.length <= 10000
      },
      email: {
        type: 'email',
        label: 'email',
        inputProps: {},
        valid: true,
        validator: val => isEmail.test(val)
      },
      valid: false
    };
  }

  updateFormControl = (key, value) => {
    const newFcState = Object.assign({}, this.state[key], {value});
    newFcState.valid = newFcState.validator(value);
    this.setState({[key]: newFcState});
  };

  render() {
    const formControlMarkup = Object.values(this.state)
      .filter(property => property && property.type)
      .map(formControl => {
        const inputName = 'signup-' + formControl.label;
        return (
          <Grid key={formControl.label} item xs={10}>
            <FormControl fullWidth >
              <InputLabel htmlFor={inputName}>
                {upperCaseFirstLetter(formControl.label)}
              </InputLabel>
              <Input id={inputName} value={this.state[formControl.label].value} type={formControl.type}
                     onChange={event => this.updateFormControl(formControl.label, event.target.value)}
                     required inputProps={formControl.inputProps} error={!formControl.valid}
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
