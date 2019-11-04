import React from 'react';
import {connect} from 'react-redux';
import SearchGameInput from './search-input';

class SearchContainer extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <SearchGameInput />
    );
  }
}

const dispatchMap = {};

export default connect(null, dispatchMap)(SearchContainer);
