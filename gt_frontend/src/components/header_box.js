import React, { Component } from 'react';
import { connect } from 'react-redux';
import { logIn, signup } from '../reducers/actions';
import { config } from '../constants';
import { Link } from 'react-router-dom';

import LoginBox from './login_box';

const mapStateToProps = state => {
  return {
    loggedIn: state.profile.id != undefined,
    email: state.profile.email
  }
}

class HeaderBox extends Component {
  constructor(props) {
    super(props);
    this.state = { loginShowing: false }
    this.toggleLoginShowing = this.toggleLoginShowing.bind(this);
  }
  toggleLoginShowing() {
    this.setState({ loginShowing: !this.state.loginShowing });
  }
  render() {
    const loginDropdown = this.state.loginShowing ? (<LoginBox />) : null;
    return (
      <header className="row col s12">
        <SiteTitle title={config.siteTitle} />
        <div className="row center-align">
          <LoginBoxDropdownButton class="col s6" handler={this.toggleLoginShowing} />
          <Link class="col s6" to="/signup">Sign up</Link>
        </div>
        <div className="divider"></div>
        {loginDropdown}
      </header>
    )
  }
}

function SiteTitle(props) {
  return (
    <Link className="row valign-wrapper" to="/">
      <i className="material-icons large col s2 l1">gamepad</i>
      <div className="col l1"></div>
      <h1 className="col s10 offset-left">{props.title}</h1>
    </Link>
  )
}

function LoginBoxDropdownButton(props) {
  return (
    <button className="btn-large red waves-effect waves-light" onClick={props.handler}>Log In</button>
  )
}

export default connect(mapStateToProps, { logIn, signup })(HeaderBox);