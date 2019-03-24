import React, { Component } from 'react';
import { config } from '../constants';
import { Link, withRouter } from 'react-router-dom';

import LoginBox from './login_box';

class HeaderBoxCpt extends Component {
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
        <LoggedOutNavBar path={this.props.location.pathname} />
      </header>
    )
  }
}

const LoggedOutNavBar = props => {
  const tabs = [
    { to: '/', tabName: 'Welcome' },
    { to: '/login', tabName: 'Log In' },
    { to: '/signup', tabName: 'Sign Up' }
  ];
  const tabMarkup = tabs.map(t => {
    let active = false;
    if (props.path.startsWith(t.to)) active = true;
    return (<NavTab key={t.to} active={active} to={t.to}>{t.tabName}</NavTab>);
  });
  return (
    <nav className="nav-extended col s12">
      <div className="nav-content">
        <ul className="tabs tabs-transparent">
          {tabMarkup}
        </ul>
      </div>
    </nav>
  );
};

const NavTab = props => {
  let classes = 'tab';
  if (props.active) classes += ' active';
  return (
    <li className={classes}><Link to={props.to}>{props.children}</Link></li>
  );
};

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

const HeaderBox = withRouter(HeaderBoxCpt);
export default HeaderBox;
