import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { signup, search } from './reducers/actions';
import { connect } from 'react-redux';
import { Route, Link } from 'react-router-dom';
import { HomePage, HeaderBox, SignupPage, LoginPage, Loading } from './components';

const mapStateToProps = state => {
  return {
    loading: state.ui.loading
  }
}

class App extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
        <main >
          <HeaderBox />
          <Loading show={this.props.loading} />
          <div className="content container">
            <Route path="/home" component={HomePage} />
            <Route path="/login" component={LoginPage} />
            <Route path="/signup" component={SignupPage} />
          </div>
        </main>
    );
  }
}

export default connect(mapStateToProps, { signup, search })(App);
