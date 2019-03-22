import React, { Component } from 'react';
import { connect } from 'react-redux';
import { logIn } from '../reducers/actions';
import { Link } from 'react-router-dom';

const mapStateToProps = state => {
  return {};
}

class LoginBox extends Component {
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
      <aside>
        <h3>Log in</h3>
        <LoginForm submit={this.sendLogin} email={this.state.email} password={this.state.password} 
          emailHandler={e => this.setState({ email: e.target.value })} 
          passwordHandler={e => this.setState({ password: e.target.value })} />
        <div>
          <Link to="/signup">Sign up</Link>
          <Link to="/reset">Forgot your password?</Link>
        </div>
      </aside>
    )
  }
}

function LoginForm(props) {
  return (
    <form onSubmit={props.submit}>
      <div className="form-control">
        <label htmlFor="email-login">Email</label>
        <input id="email-login" type="email" value={props.email} onChange={props.emailHandler} />
      </div>
      <div className="form-control">
        <label htmlFor="password-login">Password</label>
        <input id="password-login" type="password" value={props.password} onChange={props.passwordHandler} />
      </div>
      <input type="submit" value="Log in" />
    </form>
  )
}

export default connect(mapStateToProps, { logIn })(LoginBox);
