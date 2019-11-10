import React from 'react';
import Box from '@material-ui/core/Box';
import {LoginDropdown} from '../user';
import {ListItemTextAndIcon} from './nav-link-with-icon';

export default class DesktopLoginLink extends React.Component {
  constructor(props) {
    super(props);

    this.state = {open: false};
  }

  toggleOpen = () => this.setState({open: !this.state.open});

  render() {
    return (
      <Box style={{cursor: 'pointer'}}>
        <ListItemTextAndIcon desktop={this.props.desktop}
                             route={this.props.route}
                             onClick={this.toggleOpen} />
        {this.state.open ? (
          <LoginDropdown onLogin={this.toggleOpen} />
        ) : null}
      </Box>
    );
  }
}
