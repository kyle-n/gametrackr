import React from 'react';
import {connect} from 'react-redux';

import UserForm from './user-form';

class UserFormContainer extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <UserForm />
    );
  }
}

export default connect()(UserFormContainer);
