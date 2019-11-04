import React from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import SearchIcon from '@material-ui/icons/Search';
import {searchGame} from '../external-connectors';

export default class SearchGameInput extends React.Component {
  constructor(props) {
    super(props);
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
          <FormControl fullWidth>
            <InputLabel htmlFor="game-search-input">
              Search games
            </InputLabel>
            <Input id="game-search-input"
                   type="text"
                   name="Search games"
                   autoFocus
            />
          </FormControl>
        </Grid>
      </Grid>
    );
  }
}
