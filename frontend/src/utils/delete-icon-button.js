import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import ConfirmDelete from './confirm-delete';

export default class DeleteIconButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {modalOpen: false};
  }

  toggleModalOpen = () => this.setState({modalOpen: !this.state.modalOpen});

  render() {
    return (
      <span>
        <IconButton onClick={this.toggleModalOpen}>
          <DeleteIcon />
        </IconButton>
        <ConfirmDelete entityType={this.props.entityType}
                      entityId={this.props.entityId}
                      open={this.state.modalOpen}
                      onClose={this.toggleModalOpen}
                      onConfirm={this.props.onConfirm} />
      </span>
    );
  }
}
