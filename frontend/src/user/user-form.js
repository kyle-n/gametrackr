import React from 'react';
import Grid from '@material-ui/core/Grid';
import SignupIcon from '@material-ui/icons/PersonAdd'
import {Formik, Form} from 'formik';
import {SubmitButton, GtFormControl} from '../utils';

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
                    <GtFormControl key={fc.label}
                                   formControl={fc}
                                   idPrefix="user"
                                   value={formik.values[fc.label]}
                                   onChange={formik.handleChange}
                    />
                  );
                })}
                <Grid item xs={12} style={{marginTop: '1rem'}}>
                  <SubmitButton disabled={formik.isSubmitting}
                                value="Create account"
                                icon={SignupIcon}
                   />
                </Grid>
              </Form>
            )}
          </Formik>
        </Grid>
      </Grid>
    );
  }
}
