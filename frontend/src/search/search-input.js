import React from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';
import SearchIcon from '@material-ui/icons/Search';
import {searchGame} from '../external-connectors';

export default class SearchGameInput extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
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
    );
  }
}
