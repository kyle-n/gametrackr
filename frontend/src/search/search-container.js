import React from 'react';
import {connect} from 'react-redux';
import SearchInput from './search-input';
import {searchGame} from '../external-connectors';

class SearchContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchResults: [],
      loading: false
    };
  }

  searchGames = query => {
    this.setState({loading: true}, async () => {
      const resp = await searchGame(query);
      this.setState({searchResults: resp.games, loading: false});
    });
  };

  render() {
    return (
      <SearchInput searchType="games"
                   setQuery={this.searchGames}
                   loading={this.state.loading}
      />
    );
  }
}

const dispatchMap = {};

export default connect(null, dispatchMap)(SearchContainer);
