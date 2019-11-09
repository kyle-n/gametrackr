import React from 'react';
import {connect} from 'react-redux';
import {sendAlert} from '../redux';
import Snackbar from '@material-ui/core/Snackbar';
import ErrorIcon from '@material-ui/icons/Error';
import CheckIcon from '@material-ui/icons/Check';
import {debounce} from 'throttle-debounce';

class AlertContainer extends React.Component {
  constructor(props) {
    super(props);

    this.initializeDebouncer();
  }

  initializeDebouncer() {
    const alertInterval = 3 * 1000;
    const clearAlert = () => this.props.sendAlert(null, null);
    this.debouncedClearAlert = debounce(alertInterval, clearAlert);
  }

  componentDidUpdate() {
    if (this.props.type || this.props.message) this.debouncedClearAlert();
  }

  componentDidMount() {
    if (this.props.type || this.props.message) this.debouncedClearAlert();
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
        icon = null;
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
        {props.icon ? (
          <props.icon style={{marginRight: '1rem'}} />
        ) : null}
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
