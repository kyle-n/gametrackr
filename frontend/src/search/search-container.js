import React from 'react';
import {connect} from 'react-redux';

class SearchContainer extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <p>Search stuff</p>
    );
  }
}

const dispatchMap = {};

export default connect(null, dispatchMap)(SearchContainer);
