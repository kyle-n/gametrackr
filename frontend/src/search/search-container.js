import React from 'react';
import {connect} from 'react-redux';
import SearchInput from './search-input';
import GameResultsBox from './game-results-box';
import {searchGame} from '../external-connectors';
import {sendAlert} from '../redux';
import {withRouter, Redirect} from 'react-router-dom';
import qs from 'qs';

class SearchContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchResults: [],
      query: null,
    };
    const queryParams = qs.parse(this.props.location.search, {ignoreQueryPrefix: true});
    if (queryParams.q) this.state.query = queryParams.q;
  }

  componentDidMount() {
    if (this.state.query) this.searchGames(this.state.query);
  }

  searchGames = query => {
    this.setState({query}, async () => {
      const resp = await searchGame(query);
      if (!resp) return this.props.sendAlert('Could not load games');
      this.setState({searchResults: resp.games, query: null});
    });
  };

  render() {
    return (
      <div>
        <RedirectToQueryPage query={this.state.query} />
        <SearchInput searchType="games"
                     setQuery={this.searchGames}
                     loading={!!(this.state.query)}
                     preset={this.state.query}
        />
        <GameResultsBox games={this.state.searchResults} />
      </div>
    );
  }
}

const RedirectToQueryPage = props => {
  return props.query ? (<Redirect to={'/search?q=' + props.query} />) : null;
};

const dispatchMap = {sendAlert};

export default withRouter(connect(null, dispatchMap)(SearchContainer));
