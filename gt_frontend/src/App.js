import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { signup, search } from './reducers/actions';
import { connect } from 'react-redux';
import { Route, Link } from 'react-router-dom';
import { HomePage, HeaderBox, SignupPage } from './components';

const mapStateToProps = state => {
  return {
  }
}

class App extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const styles = {
      padding: '1rem'
    }
    return (
        <main style={styles}>
          <HeaderBox />
          <Link to="/home">Home</Link>
          <Route path="/home" component={HomePage} />
          <Route path="/signup" component={SignupPage} />
        </main>
    );
  }
}

export default connect(mapStateToProps, { signup, search })(App);
