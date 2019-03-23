import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { debounce, validEmail } from '../utils';
import { config } from '../constants';

const { serverUrl } = config;

export default class EmailChecker extends Component {
  constructor(props) {
    super(props);
    this.state = { email: this.props.val, status: '', msg: '' };
    this.sendToServer = debounce(this.sendToServer, 2000);
  }
  updateState(email) {
    this.setState({ email });
    if (email.length < 3) return;
    if (validEmail(email)) this.setState({ status: '', msg: '' });
    this.sendToServer(email);
  }
  sendToServer(email) {
    if (!validEmail(email)) return this.setState({ status: 'error', msg: 'Invalid email address' });
    axios.get(`${serverUrl}/api/external/email-taken?email=${email}`).then(resp => {
      if (resp.data.taken === false) {
        this.setState({ status: 'success', msg: '' });
        this.props.sendVerified(email);
      } else this.setState({ status: 'error', msg: 'Email is already taken' });
    });
  }
  render() {
    let message, checkmark;
    if (this.state.status === 'error') message = (<div>Error: {this.state.msg}</div>);
    else if (this.state.status === 'success') checkmark = (<span>&#x2713;</span>);
    return (
      <div>
        <input type="email" id="email-checker" value={this.state.email} onChange={e => this.updateState(e.target.value)} />
        {checkmark}
        {message}
      </div>
    )
  }
}

EmailChecker.propTypes = {
  sendVerified: PropTypes.func.isRequired,
  val: PropTypes.string.isRequired
};
