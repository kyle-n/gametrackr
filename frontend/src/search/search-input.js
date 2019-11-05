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
             endAdornment={(<Spinner loading={props.loading} />)}
      />
    </FormControl>
  );
};

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
