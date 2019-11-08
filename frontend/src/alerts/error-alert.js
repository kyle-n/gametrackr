import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import ErrorIcon from '@material-ui/icons/Error';

const ErrorAlert = props => (
  <Snackbar anchorOrigin={{vertical: 'bottom', horizontal: 'left'}} message={(
      <span>
        <ErrorIcon />
        {props.message}
      </span>
  )}>
  </Snackbar>
);

export default ErrorAlert;
