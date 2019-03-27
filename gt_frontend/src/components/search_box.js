import React, { Component } from 'react';
import { connect } from 'react-redux';
import { search } from '../reducers/actions';
import { debounce } from '../utils';

const mapStateToProps = state => {
  return {
  };
}

class SearchBox extends Component {
  constructor(props) {
    super(props);
    this.state = { query: '', loading: false };
    this.sendQuery = debounce(this.sendQuery, 500);
  }
  sendQuery() {
    if (!this.state.query) return;
    this.props.search(this.state.query);
  }
  updateQuery(query) {
    this.setState({ query }, this.sendQuery);
  } 
  render() {
    return (
      <div className="input-field">
        <i className="material-icons prefix">search</i>
        <label htmlFor="search-box">Search</label>
        <input type="text" id="search-box" autoFocus value={this.state.query}
        onChange={e => this.updateQuery(e.target.value)} />
      </div>
    );
  }
}

export default connect(mapStateToProps, { search })(SearchBox);
