import React, { Component } from 'react';
import { connect } from 'react-redux';
import { signup } from '../reducers/actions';
import PropTypes from 'prop-types';
import { config } from '../constants';
import EmailChecker from './email_checker';
import { debounce, validPassword } from '../utils';

const mapStateToProps = state => {
  return {};
}

class SignupPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      passwordOne: '',
      passwordTwo: '',
      validity: {
        valid: false,
        oneInvalid: false,
        twoInvalid: false,
        noMatch: false
      }
    };
    this.setEmail = this.setEmail.bind(this);
    this.setPasswordField = this.setPasswordField.bind(this);
    this.processSignup = this.processSignup.bind(this);
    this.checkPasswords = debounce(this.checkPasswords, 2000);
  }
  setEmail(email) {
    this.setState({ email });
  }
  setPasswordField(oneOrTwo, value) {
    const update = {};
    update[oneOrTwo] = value;
    this.setState(update);
    if (this.state.passwordOne && oneOrTwo === 'passwordTwo' && value) this.checkPasswords();
  }
  checkPasswords() {
    console.log('checking pw');
    const update = { validity: {} };
    update.validity.oneInvalid = !validPassword(this.state.passwordOne);
    update.validity.twoInvalid = !validPassword(this.state.passwordTwo);
    update.validity.noMatch = this.state.passwordOne !== this.state.passwordTwo;
    update.validity.valid = !update.validity.oneInvalid && !update.validity.twoInvalid && !update.validity.noMatch;
    this.setState(update);
    console.log(update, 'update');
  }
  processSignup(e) {
    e.preventDefault();
    this.signup(this.state.email, this.state.passwordOne);
  }
  render() {
    return (
      <div>
        <SignupHeader />
        <SignupForm submit={this.processSignup} setEmail={this.setEmail} setPw={this.setPasswordField}
                    email={this.state.email} pwOne={this.state.passwordOne} pwTwo={this.state.passwordTwo} 
                    disabled={!this.state.validity.valid} oneInvalid={this.state.validity.oneInvalid}
                    twoInvalid={this.state.validity.twoInvalid} noMatch={this.state.validity.noMatch} />
      </div>
    );
  }
}

const SignupForm = props => (
  <form onSubmit={props.submit}>
    <div className="form-control">
      <label htmlFor="email-checker">Email</label>
      <EmailChecker val={props.email} sendVerified={props.setEmail} />
    </div>
    <div className="form-control">
      <label htmlFor="signup-password">Password</label>
      <input type="password" id="signup-password" value={props.pwOne} onChange={e => props.setPw('passwordOne', e.target.value)} />
      <PasswordWarning display={props.oneInvalid} type="invalid" />
    </div>
    <div className="form-control">
      <label htmlFor="repeat-password">Password (again)</label>
      <input type="password" id="repeat-password" value={props.pwTwo} onChange={e => props.setPw('passwordTwo', e.target.value)} />
      <PasswordWarning display={props.twoInvalid} type="invalid" />
    </div>
    <PasswordWarning display={props.noMatch} type="noMatch" />
    <button type="submit" disabled={props.disabled}>Sign up</button>
  </form>
);

SignupForm.propTypes = {
  submit: PropTypes.func.isRequired,
  email: PropTypes.string.isRequired,
  setEmail: PropTypes.func.isRequired,
  pwOne: PropTypes.string.isRequired,
  pwTwo: PropTypes.string.isRequired,
  setPw: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired
};

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

const PasswordWarning = props => {
  if (!props.display) return null;
  let msg;
  switch (props.type) {
    case 'invalid':
      msg = 'Passwords must be at least 6 characters with at least 1 number';
      break;
    case 'noMatch':
      msg = 'Passwords must match';
      break;
    default:
      msg = 'Unknown error';
      break;
  }
  return (
    <div className="form-warning">{msg}</div>
  );
};

PasswordWarning.propTypes = {
  display: PropTypes.bool.isRequired,
  type: PropTypes.string.isRequired
};

export default connect(mapStateToProps, { signup })(SignupPage);