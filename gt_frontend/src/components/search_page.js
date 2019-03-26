import React from 'react';
import SearchBox from './search_box';
import GameResults from './game_results';

const SearchPage = props => (
  <div>
    <h1>Search</h1>
    <SearchBox />
    <GameResults />
  </div>
);

export default SearchPage;
