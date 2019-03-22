import React, { Component } from 'react';
import { connect } from 'react-redux';
import { logIn, signup } from '../reducers/actions';
import { config } from '../constants';

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
      <header>
        <SiteTitle title={config.siteTitle} />
        <LoginBoxDropdownButton handler={this.toggleLoginShowing} />
        {loginDropdown}
      </header>
    )
  }
}

function SiteTitle(props) {
  return (
    <h1>{props.title}</h1>
  )
}

function LoginBoxDropdownButton(props) {
  return (
    <button onClick={props.handler}>Log In</button>
  )
}

export default connect(mapStateToProps, { logIn, signup })(HeaderBox);