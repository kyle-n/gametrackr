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
        noMatch: false
      }
    };
    this.setEmail = this.setEmail.bind(this);
    this.setPasswordField = this.setPasswordField.bind(this);
    this.processSignup = this.processSignup.bind(this);
    this.checkPasswords = debounce(this.checkPasswords, 1000);
  }
  setEmail(email) {
    this.setState({ email });
  }
  setPasswordField(oneOrTwo, value) {
    const update = { validity: { valid: false, noMatch: true } };
    update[oneOrTwo] = value;
    this.setState(update);
    if (this.state.passwordOne && oneOrTwo === 'passwordTwo' && value) this.checkPasswords();
  }
  checkPasswords() {
    console.log('checking pw');
    const update = { validity: {} };
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
                    disabled={!this.state.validity.valid} noMatch={this.state.validity.noMatch} />
      </div>
    );
  }
}


const SignupForm = props => {
  const pwPattern = '.{6,}'
  const pwErrMsg = 'Passwords must be at least 6 characters';
  return (
    <form onSubmit={props.submit} className="section">
      <EmailChecker val={props.email} sendVerified={props.setEmail} />
      <div className="input-field">
        <i className="material-icons prefix">vpn_key</i>
        <label htmlFor="signup-password">Password</label>
        <input type="password" id="signup-password" value={props.pwOne} onChange={e => props.setPw('passwordOne', e.target.value)} 
          pattern={pwPattern} className="validate" required />
        <span className="helper-text" data-error={pwErrMsg}></span>
      </div>
      <div className="input-field">
        <i className="material-icons prefix"></i>
        <label htmlFor="repeat-password">Password (again)</label>
        <input type="password" id="repeat-password" value={props.pwTwo} onChange={e => props.setPw('passwordTwo', e.target.value)} 
          pattern={pwPattern} className="validate" />
        <span className="helper-text" data-error={pwErrMsg}></span>
      </div>
      <span className={props.noMatch ? 'helper-text' : 'hide' } data-error="Passwords must match"></span>
      <button className="btn" type="submit" disabled={props.disabled}>Sign up<i className="material-icons right">send</i></button>
    </form>
  );
};

SignupForm.propTypes = {
  submit: PropTypes.func.isRequired,
  email: PropTypes.string.isRequired,
  setEmail: PropTypes.func.isRequired,
  pwOne: PropTypes.string.isRequired,
  pwTwo: PropTypes.string.isRequired,
  setPw: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  noMatch: PropTypes.bool.isRequired
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
    <div className="helper-text red-text">{msg}</div>
  );
};

PasswordWarning.propTypes = {
  display: PropTypes.bool.isRequired,
  type: PropTypes.string.isRequired
};

export default connect(mapStateToProps, { signup })(SignupPage);