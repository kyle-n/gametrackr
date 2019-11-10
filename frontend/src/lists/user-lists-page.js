import React from 'react';
import UserListsContainer from './user-lists-container';
import {PageTitle} from '../utils';

const UserListsPage = () => (
  <div>
    <PageTitle title="My lists" />
    <UserListsContainer />
  </div>
);

export default UserListsPage;
