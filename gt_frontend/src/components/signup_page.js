import React, { Component } from 'react';
import { connect } from 'react-redux';
import { signup } from '../reducers/actions';
import PropTypes from 'prop-types';
import { config } from '../constants';
import EmailChecker from './email_checker';

const mapStateToProps = state => {
  return {};
}

class SignupPage extends Component {
  constructor(props) {
    super(props);
    this.state = { email: '', password: '' };
    this.setEmail = this.setEmail.bind(this);
  }
  setEmail(email) {
    this.setState({ email });
  }
  render() {
    return (
      <div>
        <SignupHeader />
        <EmailChecker val={this.state.email} sendVerified={this.setEmail} />
      </div>
    );
  }
}

const SignupHeader = props => (
  <div>
    <h2>Sign up</h2>
    <p>{config.siteTitle} requires an email and password to track your data. I will never:</p>
    <ul>
      <li>Give your email to a third party</li>
      <li>Email you for anything other than account-related matters</li>
    </ul>
  </div>
);

export default connect(mapStateToProps, { signup })(SignupPage);