import React from 'react';
import {connect} from 'react-redux';
import ListResults from './list-results';
import {getUserLists} from '../external-connectors';
import {sendAlert} from '../redux';

// const mockList = {
//   title: 'Test list',
//   createdAt: new Date(),
//   deck: 'This is my test list',
//   userId: 1,
//   id: 1
// }

class UserListsContainer extends React.Component {
  constructor(props) {
    super(props);

    // this.state = {lists: [mockList]};
    this.state = {lists: []};
  }

  async componentDidMount() {
    const lists = await getUserLists(this.props.userId);
    if (!lists) return this.props.sendAlert('Could not load your lists', 'error');
    this.setState({lists});
  }

  deleteList = listId => console.log('list deleted', listId);

  render() {
    return (
      <ListResults lists={this.state.lists} onDelete={this.deleteList} />
    );
  }
}

const mapStateToProps = state => {
  return {userId: state.userId}
};

const dispatchMaps = {sendAlert};

export default connect(mapStateToProps, dispatchMaps)(UserListsContainer)
