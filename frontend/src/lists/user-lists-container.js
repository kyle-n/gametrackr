import React from 'react';
import {connect} from 'react-redux';
import {getUserLists} from '../external-connectors';
import {sendAlert} from '../redux';

class UserListsContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {lists: []};
  }

  async componentDidMount() {
    const lists = await getUserLists(this.props.userId);
    if (!lists) return this.props.sendAlert('Could not load your lists', 'error');
    this.setState({lists});
  }

  render() {
    return (
      <p>container</p>
    );
  }
}

const mapStateToProps = state => {
  return {userId: state.userId}
};

const dispatchMaps = {sendAlert};

export default connect(mapStateToProps, dispatchMaps)(UserListsContainer)
