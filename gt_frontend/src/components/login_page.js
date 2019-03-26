import React, { Component } from 'react';
import { connect } from 'react-redux';
import { logIn } from '../reducers/actions';
import { Link } from 'react-router-dom';

const mapStateToProps = state => {
  return {};
}

class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    };
    this.sendLogin = this.sendLogin.bind(this);
  }
  sendLogin(e) {
    e.preventDefault();
    this.props.logIn(this.state.email, this.state.password);
  }
  render() {
    return (
      <div>
        <h3>Log in</h3>
        <LoginForm submit={this.sendLogin} email={this.state.email} password={this.state.password} 
          emailHandler={e => this.setState({ email: e.target.value })} 
          passwordHandler={e => this.setState({ password: e.target.value })} />
      </div>
    )
  }
}

function LoginForm(props) {
  return (
    <form onSubmit={props.submit}>
      <div className="input-field">
        <label htmlFor="email-login">Email</label>
        <input id="email-login" required type="email" value={props.email} onChange={props.emailHandler} />
      </div>
      <div className="input-field">
        <label htmlFor="password-login">Password</label>
        <input id="password-login" required type="password" value={props.password} onChange={props.passwordHandler} />
      </div>
      <button type="submit" className="btn">Log In<i className="material-icons right">send</i></button>
    </form>
  )
}

export default connect(mapStateToProps, { logIn })(LoginPage);
