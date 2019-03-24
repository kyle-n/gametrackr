import React, { Component } from 'react';
import { config } from '../constants';
import { Link, withRouter } from 'react-router-dom';
import M from 'materialize-css/dist/js/materialize.min';

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
        <NavBar path={this.props.location.pathname} />
      </header>
    )
  }
}

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.tabs = [
      { to: '/', tabName: 'Welcome' },
      { to: '/login', tabName: 'Log In' },
      { to: '/signup', tabName: 'Sign Up' }
    ];
    this.closeSidebar = this.closeSidebar.bind(this);
  }
  componentDidMount() {
    this.sidebar = M.Sidenav.init(document.querySelector('#mobile-nav'));
  }
  closeSidebar(e) {
    if (e.target.tagName === 'A') this.sidebar.close();
  }
  render() {
    //const circleButtonCss = { borderRadius: '50%', width: '5rem', height: '5rem', position: 'relative', top: '0' };
    const circleButtonCss = { borderRadius: '50%', width: 'auto', height: '3.5rem' };
    const titleCss = { fontSize: '3rem' };
    const titleBoxCss = { padding: '0', height: '3.5rem' };
    const ctr = { height: '3.5rem' }
    const navStyle = { padding: '1rem 0 0 0' };
    const tabMarkup = this.tabs.map(t => {
      let active = false;
      if (this.props.path.startsWith(t.to)) {
        if (t.to === '/') active = t.to === this.props.path;
        else active = true;
      }
      return (<NavTab key={t.to} active={active} to={t.to}>{t.tabName}</NavTab>);
    });
    return (
      <div>
        <nav className="nav-extended col s12 valign-wrapper" style={navStyle}>
          <div className="row col s12 valign-wrapper left bordered" style={ctr}>
            <div className="col s2 bordered">
              <a href="#" style={circleButtonCss} className="btn transparent sidenav-trigger z-depth-2 blue lighten-1 hide-on-med-and-up col s2" data-target="mobile-nav">
                <i className="material-icons z-depth-0">menu</i>
              </a>
            </div>
            <div className="col s10 center-align bordered" style={titleBoxCss}>
              <Link to="/" className="" style={titleCss}>{config.siteTitle}</Link>
            </div>
            <ul id="nav-desktop" className="right col m5 hide-on-small-only">
              {tabMarkup}
            </ul>
          </div>
        </nav>
        <ul id="mobile-nav" onClick={this.closeSidebar} className="sidenav red lighten-2 white-text">
          {tabMarkup}
        </ul>
      </div>
    );
  }
};

const NavTab = props => {
  let classes = 'tab';
  if (props.active) classes += ' active';
  return (
    <li className={classes}><Link className="white-text" to={props.to}>{props.children}</Link></li>
  );
};

function LoginBoxDropdownButton(props) {
  return (
    <button className="btn-large red waves-effect waves-light" onClick={props.handler}>Log In</button>
  )
}

const HeaderBox = withRouter(HeaderBoxCpt);
export default HeaderBox;
