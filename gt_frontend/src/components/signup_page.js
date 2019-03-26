import React, { Component } from 'react';
import { connect } from 'react-redux';
import { signup } from '../reducers/actions';
import PropTypes from 'prop-types';
import { config } from '../constants';
import EmailChecker from './email_checker';
import { debounce, validPassword } from '../utils';
import { textSpanIntersectsWithTextSpan } from 'typescript';

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
      valid: false,
      oneInvalid: undefined,
      twoInvalid: undefined,
      noMatch: false
    };
    this.setEmail = this.setEmail.bind(this);
    this.setPasswordField = this.setPasswordField.bind(this);
    this.processSignup = this.processSignup.bind(this);
    this.checkPwMatch = this.checkPwMatch.bind(this);
    this.checkValidPw = this.checkValidPw.bind(this);
  }
  setEmail(email) {
    this.setState({ email });
  }
  setPasswordField(oneOrTwo, value) {
    const update = { valid: false };
    update[oneOrTwo] = value;
    this.setState(update, () => {
      const invalidField = oneOrTwo === 'passwordOne' ? 'oneInvalid' : 'twoInvalid';
      if (this.state[invalidField]) {
        this.checkValidPw(oneOrTwo);
      }
    });
  }
  checkValidPw(oneOrTwo) {
    const update = {};
    const invalidField = oneOrTwo === 'passwordOne' ? 'oneInvalid' : 'twoInvalid';
    update[invalidField] = !validPassword(this.state[oneOrTwo]);
    const other = oneOrTwo === 'passwordOne' ? 'twoInvalid' : 'oneInvalid';
    update.valid = !this.state.noMatch && this.state[other] === false && update[invalidField] === false
      && this.state.passwordOne && this.state.passwordTwo && this.state.email;
    return this.setState(update, () => {
      if (oneOrTwo === 'passwordTwo') this.checkPwMatch();
    });
  }
  checkPwMatch() {
    const update = {};
    update.noMatch = this.state.passwordOne !== this.state.passwordTwo;
    update.valid = !update.noMatch && this.state.oneInvalid === false && this.state.twoInvalid === false && this.state.email;
    this.setState(update);
  }
  processSignup(e) {
    e.preventDefault();
    this.props.signup(this.state.email, this.state.passwordOne);
  }
  render() {
    return (
      <div>
        <SignupHeader />
        <SignupForm submit={this.processSignup} setEmail={this.setEmail} setPw={this.setPasswordField}
                    email={this.state.email} pwOne={this.state.passwordOne} pwTwo={this.state.passwordTwo} 
                    disabled={!this.state.valid} noMatch={this.state.noMatch}
                    checkValidPw={this.checkValidPw} checkMatch={this.checkPwMatch}
                    oneInvalid={this.state.oneInvalid} twoInvalid={this.state.twoInvalid} />
      </div>
    );
  }
}


const SignupForm = props => {
  const pwErrMsg = 'Passwords must have at least 6 characters and 1 number';
  let pOneCss = '', pTwoCss = '';
  if (props.oneInvalid) pOneCss = 'invalid';
  else if (props.oneInvalid === false) pOneCss = 'valid';
  if (props.twoInvalid) pTwoCss = 'invalid';
  else if (props.twoInvalid === false) pTwoCss = 'valid';
  return (
    <form onSubmit={props.submit} className="section">
      <EmailChecker val={props.email} sendVerified={props.setEmail} />
      <div className="input-field">
        <i className="material-icons prefix">vpn_key</i>
        <label htmlFor="signup-password">Password</label>
        <input type="password" id="signup-password" value={props.pwOne} onChange={e => props.setPw('passwordOne', e.target.value)} 
          className={pOneCss} required
          onBlur={() => props.checkValidPw('passwordOne')} />
        <span className="helper-text" data-error={pwErrMsg}></span>
      </div>
      <div className="input-field">
        <i className="material-icons prefix"></i>
        <label htmlFor="repeat-password">Password (again)</label>
        <input type="password" id="repeat-password" value={props.pwTwo} onChange={e => props.setPw('passwordTwo', e.target.value)} 
          className={pTwoCss} required onBlur={() => props.checkValidPw('passwordTwo')} />
        <span className="helper-text" data-error={pwErrMsg}></span>
        <div className={props.noMatch ? 'helper-text red-text' : 'hide' }>Passwords must match</div>
      </div>
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

export default connect(mapStateToProps, { signup })(SignupPage);