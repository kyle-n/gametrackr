import React, { Component } from 'react';
import { connect } from 'react-redux';

const mapStateToProps = state => {
  return {
    token: state.profile.token
  };
}

const HomePage = state => (
  <h1>Welcome back.</h1>
);

export default connect(mapStateToProps, {})(HomePage);
