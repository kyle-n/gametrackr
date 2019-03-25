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
    const tabMarkup = this.tabs.map(t => {
      let active = false;
      if (this.props.path.startsWith(t.to)) {
        if (t.to === '/') active = t.to === this.props.path;
        else active = true;
      }
      return (<NavTab key={t.to} active={active} to={t.to}>{t.tabName}</NavTab>);
    });
    const titleCss = { fontSize: '3rem', verticalAlign: 'bottom' };
    return (
      <div>
        <nav className="nav-wrapper col s12">
          <div className="row col s12 valign-wrapper left">
            <div className="col s2 hide-on-med-and-up">
              <SidenavMenuButton />
            </div>
            <div className="col s1 hide-on-med-and-up"></div>
            <div className="col s9 m4">
              <Link to="/" style={titleCss} >{config.siteTitle}</Link>
            </div>
            <div class="col m8 hide-on-small-only">
              <ul className="right" id="nav-desktop">
                {tabMarkup}
              </ul>
            </div>
          </div>
        </nav>
        <ul id="mobile-nav" onClick={this.closeSidebar} className="sidenav red lighten-2 white-text">
          {tabMarkup}
        </ul>
      </div>
    );
  }
};

const SidenavMenuButton = () => (
  <a href="#" style={{ borderRadius: '50%', width: '100%', height: '100%' }} className="btn transparent sidenav-trigger z-depth-2 blue lighten-1 hide-on-med-and-up col s2" data-target="mobile-nav">
    <i className="material-icons z-depth-0">menu</i>
  </a>
);

const NavTab = props => {
  let classes = 'tab';
  if (props.active) classes += ' active';
  return (
    <li className={classes}><Link className="white-text" to={props.to}>{props.children}</Link></li>
  );
};

const HeaderBox = withRouter(HeaderBoxCpt);
export default HeaderBox;
