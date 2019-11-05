import React from 'react';
import SearchContainer from './search-container';
import {PageTitle} from '../utils';

const SearchPage = props => (
  <div>
    <PageTitle title="Search" />
    <SearchContainer />
  </div>
);

export default SearchPage;
