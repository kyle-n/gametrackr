import React from 'react';
import {connect} from 'react-redux';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

class ConfirmDelete extends React.Component {
  constructor(props) {
    super(props);

    this.state = {open: props.open};
  }

  closeDialog = () => this.setState({open: false});

  closeAndConfirm = () => {
    this.closeDialog();
    this.props.onConfirm()
  }

  render() {
    return (
      <Dialog open={this.state.open}
              onClose={this.closeDialog}>
        <DialogTitle id="confirm-delete-dialog">
          Confirm delete
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {this.props.entityType} {this.props.entityId}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.closeDialog}>
            Cancel
          </Button>
          <Button onClick={this.closeAndConfirm} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default connect()(ConfirmDelete);
