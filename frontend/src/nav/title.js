import React from 'react';
import '../utils/layout.css';
import {Link, NavLink} from "react-router-dom";
import {Tab, Tabs} from '@material-ui/core';
import {routes} from '../App';
import {MobileNav} from './hamburger-menu';

export class Title extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <header>
        <h1>gametrackr</h1>
        <MobileNav routes={this.props.routes} />
      </header>
    );
  }
}
