import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { debounce, validEmail } from '../utils';
import { config } from '../constants';

const { serverUrl } = config;

export default class EmailChecker extends Component {
  constructor(props) {
    super(props);
    this.state = { email: this.props.val, taken: false };
    this.sendToServer = debounce(this.sendToServer, 2000);
  }
  updateState(email) {
    this.setState({ email });
    if (email.length < 3) return;
    this.sendToServer(email);
  }
  sendToServer(email) {
    if (!validEmail(email)) return;
    axios.get(`${serverUrl}/api/external/email-taken?email=${email}`).then(resp => {
      if (resp.data.taken === false) {
        this.props.sendVerified(email);
      } else this.setState({ taken: true });
    });
  }
  render() {
    return (
      <div className="input-field">
        <i className="material-icons prefix">email</i>
        <label htmlFor="email-checker">Email</label>
        <input type="email" className="validate" id="email-checker" value={this.state.email} 
          onChange={e => this.updateState(e.target.value)} />
        <span className="helper-text" data-error="Must provide a valid email address"></span>
        <span className={this.state.taken ? "helper-text red-text" : "hide"}>Email is already taken</span>
      </div>
    )
  }
}

EmailChecker.propTypes = {
  sendVerified: PropTypes.func.isRequired,
  val: PropTypes.string.isRequired
};
