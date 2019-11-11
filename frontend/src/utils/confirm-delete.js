import React from 'react';
import {connect} from 'react-redux';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const ConfirmDelete = props => {
  const confirmAndClose = () => {
    props.onConfirm();
    props.onClose();
  };
  return (
    <Dialog open={props.open}
            onClose={props.onClose}>
      <DialogTitle id="confirm-delete-dialog">
        Confirm delete
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete {props.entityType} {props.entityId}?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>
          Cancel
        </Button>
        <Button onClick={confirmAndClose} color="secondary">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDelete
