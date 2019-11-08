import React from 'react';
import {connect} from 'react-redux';
import {sendAlert} from '../redux';
import Snackbar from '@material-ui/core/Snackbar';
import ErrorIcon from '@material-ui/icons/Error';
import CheckIcon from '@material-ui/icons/Check';

class AlertContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let icon;
    switch (this.props.type) {
      case 'error':
        icon = ErrorIcon
        break;
      case 'success':
        icon = CheckIcon;
        break;
      default:
        icon = CheckIcon;
        break;
    }

    return (
      <Alert type={this.props.type}
             text={this.props.text}
             icon={icon}
             open={!!(this.props.text && this.props.type)} />
    );
  }
}

const Alert = props => (
  <Snackbar anchorOrigin={{vertical: 'bottom', horizontal: 'left'}} message={(
      <span style={{display: 'flex', alignItems: 'center'}}>
        <props.icon style={{marginRight: '1rem'}} />
        {props.text}
      </span>
  )} open={props.open}>
  </Snackbar>
);

const mapStateToProps = state => {
  return {type: state.message.type, text: state.message.text};
};

const dispatchMaps = {sendAlert}

export default connect(mapStateToProps, dispatchMaps)(AlertContainer);
