import React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import SignupIcon from '@material-ui/icons/PersonAdd'
import {Formik, Form} from 'formik';
import {upperCaseFirstLetter} from '../utils';

export default class UserForm extends React.Component {
  constructor(props) {
    super(props);

    // source of truth for all FormControls in the class - everything should derive from here
    this.formControls = [
      {
        type: 'text',
        label: 'name',
        inputProps: {autoFocus: true, required: true, maxLength: 32},
        valid: true,
      },
      {
        type: 'password',
        label: 'password',
        inputProps: {required: true, maxLength: 10000},
        valid: true,
      },
      {
        type: 'email',
        label: 'email',
        inputProps: {required: true},
        valid: true,
      },
    ];
  }

  render() {
    return (
      <Grid container>
        <Grid item xs={12}>
          <Formik initialValues={{name: '', password: '', email: ''}} onSubmit={this.submitForm}>
            {formik => (
              <Form>
                {this.formControls.map(fc => {
                  return (
                    <UserFormControl key={fc.label}
                                     formControl={fc}
                                     value={formik.values[fc.label]}
                                     onChange={formik.handleChange}
                    />
                  );
                })}
                <Grid item xs={12} style={{marginTop: '1rem'}}>
                  <SubmitButton disabled={formik.isSubmitting} />
                </Grid>
              </Form>
            )}
          </Formik>
        </Grid>
      </Grid>
    );
  }
}

const UserFormControl = props => {
  const fcId = 'user-' + props.formControl.label;
  return (
    <FormControl fullWidth>
      <InputLabel htmlFor={fcId}>
        {upperCaseFirstLetter(props.formControl.label)}
      </InputLabel>
      <Input type={props.formControl.type}
             name={props.formControl.label}
             id={fcId}
             inputProps={props.formControl.inputProps}
             value={props.value}
             onChange={props.onChange}
      />
    </FormControl>
  );
};

const SubmitButton = props => (
  <Button variant="contained"
          color="primary"
          startIcon={(<SignupIcon />)}
          size="large"
          type="submit"
          onClick={props.submit}
          disabled={props.disabled}
  >
    Create account
  </Button>
);
