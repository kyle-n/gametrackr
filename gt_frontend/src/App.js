import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { connect } from 'react-redux';
import { getAllLists } from './reducers/actions';
import { Route } from 'react-router-dom';
import { HomePage, HeaderBox, SignupPage, LoginPage, Loading, SearchPage, ListsPage, ListPage } from './components';

const mapStateToProps = state => {
  return {
    loading: state.ui.loading,
    loggedIn: state.profile.token.length > 0
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    if (props.loggedIn) this.props.getAllLists();
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
            <Route path="/search" component={SearchPage} />
            <Route path="/lists" component={ListsPage} />
            <Route path="/lists/:listId" component={ListPage} />
          </div>
        </main>
    );
  }
}

export default connect(mapStateToProps, { getAllLists })(App);
