import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { signup, search } from './reducers/actions';
import { connect } from 'react-redux';

const mapStateToProps = state => {
  const gameResults = state.results.map(id => state.entities.games[id]);
  return {
    token: state.profile.token,
    results: gameResults
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { email: '', password: '' }
    this.updateField = this.updateField.bind(this);
    this.searchTest = this.searchTest.bind(this);
  }
  updateField(field, text) {
    const newState = {};
    newState[field] = text;
    this.setState(newState);
  }
  searchTest(query) {
    this.props.search('hey_ice_king');
  }
  render() {
    const titles = this.props.results.map(r => {
      return (<p key={r.id}>{r.name}</p>);
    });
    return (
      <main>
        <p>Test code</p>
        <form onSubmit={e => { e.preventDefault(); this.props.signup(this.state.email, this.state.password); }}>
          <input key={0} type="text" value={this.state.email} onChange={e => this.updateField('email', e.target.value)} />
          <input key={1} type="text" value={this.state.password} onChange={e => this.updateField('password', e.target.value)} />
          <button type="submit">Save</button>
        </form>
        <p>Token is {this.props.token}</p>
        <button onClick={this.searchTest}>Search test</button>
        {titles}
      </main>
    );
  }
}

export default connect(mapStateToProps, { signup, search })(App);
