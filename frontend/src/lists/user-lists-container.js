import React from 'react';
import {connect} from 'react-redux';

class UserListsContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <p>container</p>
    );
  }
}

export default connect()(UserListsContainer)
