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
        validator: val => val.length > 0 && val.length <= 32
      },
      {
        type: 'password',
        label: 'password',
        inputProps: {},
        valid: true,
        validator: val => val.length > 0 && val.length <= 10000
      },
      {
        type: 'email',
        label: 'email',
        inputProps: {},
        valid: true,
        validator: val => isEmail.test(val)
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

      if (!values.name) errors.name = 'Required';
      else if (values.name.length > 32) errors.name = 'Too long'

      if (!values.password) errors.password = 'Required';
      else if (values.password.length > 10000) errors.password = 'Too long';

      if (!values.email) errors.email = 'Required';
      else if (!isEmail(values.email)) errors.email = 'Invalid email address';

      return errors;
    };
  }

  updateFormControl = (key, value) => {
    this.setState({[key]: value});
  };

  render() {
    // const formControlMarkup = this.formControls.map(formControl => {
    //   const inputName = 'user-' + formControl.label;
    //   return (
    //     <Grid key={formControl.label} item xs={10}>
    //       <FormControl fullWidth >
    //         <InputLabel htmlFor={inputName}>
    //           {upperCaseFirstLetter(formControl.label)}
    //         </InputLabel>
    //         <Input id={inputName} value={this.state[formControl.label]} type={formControl.type}
    //                onChange={event => this.updateFormControl(formControl.label, event.target.value)}
    //                required inputProps={formControl.inputProps} error={!formControl.valid}
    //         />
    //       </FormControl>
    //     </Grid>
    //   );
    // });

    return (
      <Grid container>
        <Formik initialValues={this.initialValues} validate={this.validator} onSubmit={console.log}>
          {({values, errors, touched, handleChange, handleBlur, handleSubmit}) => (
            <form onSubmit={handleSubmit}>
              <Input type="name" name="name" value={values.name}
                     onChange={handleChange} onBlur={handleBlur} />
              {errors && errors.name && touched.name && (
                <FormHelperText error>{errors.name}</FormHelperText>
              )}
            </form>
          )}
          {/*<Grid item xs={12} style={{marginTop: '1rem'}}>*/}
          {/*  <Button variant="contained" color="primary" startIcon={SignupIcon} size="large"*/}
          {/*          disabled={true} >*/}
          {/*    Create account*/}
          {/*  </Button>*/}
          {/*</Grid>*/}
        </Formik>
      </Grid>
    );
  }
}
