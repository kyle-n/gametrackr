import React, { Component } from 'react';
import { connect } from 'react-redux';
import { signup } from '../reducers/actions';
import PropTypes from 'prop-types';
import { config } from '../constants';

const mapStateToProps = state => {
  return {};
}

class SignupPage extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <SignupHeader />
    )
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