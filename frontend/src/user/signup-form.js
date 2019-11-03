import React from 'react';
import {Button, Grid, TextField} from '@material-ui/core';
import {Formik} from 'formik';
import FormHelperText from '@material-ui/core/FormHelperText';
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

    // source of truth for all FormControls in the class - everything should derive from here
    this.formControls = [
      {
        type: 'text',
        label: 'name',
        inputProps: {autoFocus: true},
        valid: true,
        validator: val => {
          if (!val) return 'Required';
          else if (val.length > 32) return 'Too long';
          else return null;
        }
      },
      {
        type: 'password',
        label: 'password',
        inputProps: {},
        valid: true,
        validator: val => {
          if (!val) return 'Required';
          else if (val.length > 10000) return 'Too long';
          else return null;
        }
      },
      {
        type: 'email',
        label: 'email',
        inputProps: {},
        valid: true,
        validator: val => {
          if (!val) return 'Required';
          else if (!isEmail.test(val)) return 'Invalid email';
          else return null;
        }
      },
    ];

    // config object for Formik
    this.initialValues = {};
    Object.keys(this.formControls).forEach(formControl => {
      this.initialValues[formControl.label] = '';
    });

    // validator function
    this.validator = values => {
      const errors = {};

      Object.values(this.formControls).forEach(formControl => {
        errors[formControl.label] = formControl.validator(values[formControl.label]);
      });

      return errors;
    };
  }

  updateFormControl = (key, value) => {
    this.setState({[key]: value});
  };

  render() {
    return (
      <Grid container>
        <Grid item xs={12} sm={10}>
          <Formik initialValues={this.initialValues} validate={this.validator} onSubmit={console.log}>
            {({values, errors, touched, handleChange, handleBlur, handleSubmit}) => (
              <form onSubmit={handleSubmit}>
                {this.formControls.map(formControl => {
                  return (
                    <Grid item xs={12} key={formControl.label}>
                      <UserFormControl formControl={formControl} value={values[formControl.label]}
                                       onChange={handleChange} onBlur={handleBlur}
                                       error={touched[formControl.label] ? errors[formControl.label] : null}
                      />
                    </Grid>
                  );
                })}
                <Grid item xs={12} style={{marginTop: '1rem'}}>
                  <SubmitButton disabled={!Object.values(errors).reduce((allFalsey, fcError) => allFalsey && !fcError, true)}/>;
                </Grid>
              </form>
            )}
          </Formik>
        </Grid>
      </Grid>
    );
  }
}

const UserFormControl = props => {
  const fcName = 'user-' + props.formControl.label;
  return (
    <FormControl fullWidth>
      <InputLabel htmlFor={fcName}>{upperCaseFirstLetter(props.formControl.label)}</InputLabel>
      <Input type={props.formControl.type} name={props.formControl.label} id={fcName} value={props.value}
             onChange={props.onChange} onBlur={props.onBlur} required inputProps={props.formControl.inputProps}
             error={props.error && props.error.length > 0} />
      <UserFormControlError error={props.error} />
    </FormControl>
  );
};

const UserFormControlError = props => (
  <span>
    {props.error && (
      <FormHelperText error>{props.error}</FormHelperText>
    )}
  </span>
);

const SubmitButton = props => (
  <Button variant="contained" color="primary" startIcon={(<SignupIcon />)} size="large"
          disabled={props.disabled} >
    Create account
  </Button>
);
