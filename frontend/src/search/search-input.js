import React from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import SearchIcon from '@material-ui/icons/Search';
import {debounce} from 'throttle-debounce';

export default class SearchInput extends React.Component {
  constructor(props) {
    super(props);

    this.debouncedSetQuery = debounce(1000, props.setQuery);
  }

  render() {
    return (
        <Grid container>
        <Grid item xs={1}
              style={{textAlign: 'center', margin: 'auto 0 0 0'}}
        >
          <SearchIcon />
        </Grid>
        <Grid item xs={11}>
          <SearchFormControl searchType={this.props.searchType}
                             setQuery={this.debouncedSetQuery}
          />
        </Grid>
      </Grid>
    );
  }
}

const SearchFormControl = props => {
  const inputId = props.searchType + '-search-input';
  return (
    <FormControl fullWidth>
      <InputLabel htmlFor={inputId}>
        Search {props.searchType}
      </InputLabel>
      <Input id={inputId}
             type="text"
             name={'Search ' + props.searchType}
             autoFocus
             onChange={e => props.setQuery(e.target.value)}
      />
    </FormControl>
  );
};
