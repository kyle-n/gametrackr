import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import LoginForm from './login-form';

class LoginFormContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <LoginForm />
    );
  }
}

export default LoginFormContainer;
