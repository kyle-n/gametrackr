import React from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import SearchIcon from '@material-ui/icons/Search';
import CircularProgress from '@material-ui/core/CircularProgress';
import {debounce} from 'throttle-debounce';
import {Hidden} from '@material-ui/core';

const SearchInput = props => {
  const debouncedSetQuery = debounce(1000, props.setQuery);
  return (
      <Grid container>
      <Grid item xs={1}
            style={{textAlign: 'center', margin: 'auto 0 0 0'}}
      >
        <SearchIcon />
      </Grid>
      <Grid item xs={11}>
        <SearchFormControl searchType={props.searchType}
                           setQuery={debouncedSetQuery}
                           loading={props.loading}
        />
      </Grid>
    </Grid>
  );
};

class SearchFormControl extends React.Component {
  constructor(props) {
    super(props);

    this.state = {value: ''}
    
    this.debouncedSetQuery = debounce(1 * 1000, props.setQuery);
  }

  onChange(query) {
    this.debouncedSetQuery(query);
    this.setState({value: query});
  }

  render() {
    const inputId = this.props.searchType + '-search-input';
    return (
      <FormControl fullWidth>
        <InputLabel htmlFor={inputId}>
          Search {this.props.searchType}
        </InputLabel>
        <Input id={inputId}
              type="text"
              name={'Search ' + this.props.searchType}
              value={this.state.value}
              autoFocus
              onChange={e => this.onChange(e.target.value)}
              endAdornment={(<Spinner loading={this.props.loading} />)}
        />
      </FormControl>
    )
  }
}

const Spinner = props => (
  <span>
    {props.loading ? (
      <CircularProgress size={'1.25rem'}
                        style={{marginBottom: '0.5rem', marginRight: '0.5rem'}}
                        color="secondary"
      />
    ) : null}
  </span>
);

export default SearchInput;
