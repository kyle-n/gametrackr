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
        <LoggedOutNavBar />
      </header>
    )
  }
}

const LoggedOutNavBar = props => (
  <nav className="nav-extended col s12">
    <div className="nav-content">
      <ul className="tabs tabs-transparent">
        <NavTab to="/">Welcome</NavTab>
        <NavTab to="/login">Log In</NavTab>
        <NavTab to="/signup">Sign Up</NavTab>
      </ul>
    </div>
  </nav>
);

const NavTab = props => (
  <li className="tab"><Link to={props.to}>{props.children}</Link></li>
)

function SiteTitle(props) {
  return (
    <Link className="" to="/">
      <i className="">gamepad</i>
      <div className=""></div>
      <h1 className="">{props.title}</h1>
    </Link>
  )
}

function LoginBoxDropdownButton(props) {
  return (
    <button className="btn-large red waves-effect waves-light" onClick={props.handler}>Log In</button>
  )
}

export default connect(mapStateToProps, { logIn, signup })(HeaderBox);