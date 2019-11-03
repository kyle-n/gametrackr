import React from 'react';
import {connect} from 'react-redux';

import {SignupForm} from './signup-form';

class SignupFormContainer extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <SignupForm />
    );
  }
}

export default connect()(SignupFormContainer);
