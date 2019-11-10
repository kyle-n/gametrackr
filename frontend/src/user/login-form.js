import React from 'react';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import LoginIcon from '@material-ui/icons/ExitToApp';
import {Formik, Form} from 'formik';
import {upperCaseFirstLetter, GtFormControl, SubmitButton} from '../utils';

export default class LoginForm extends React.Component {
  constructor(props) {
    super(props);

    this.formControls = [
      {
        type: 'text',
        label: 'name',
        inputProps: {autoFocus: true, required: true, maxLength: 32},
        valid: true
      },
      {
        type: 'password',
        label: 'password',
        inputProps: {required: true, maxLength: 10000},
        valid: true
      }
    ];
  }

  render() {
    return (
      <Grid container>
        <Grid item xs={12}>
          <Formik initialValues={{name: '', password: ''}}
                  onSubmit={this.props.submitForm}>
            {formik => (
              <Form>
                {this.formControls.map(fc => {
                  return (
                    <GtFormControl key={fc.label}
                                  formControl={fc}
                                  idPrefix="login"
                                  value={formik.values[fc.label]}
                                  onChange={formik.handleChange} />
                  );
                })}
                <Grid item xs={12} style={{marginTop: '1rem'}}>
                  <SubmitButton disabled={formik.isSubmitting}
                                value="Log in"
                                icon={LoginIcon} />
                </Grid>
              </Form>
            )}
          </Formik>
        </Grid>
      </Grid>
    );
  }
}
