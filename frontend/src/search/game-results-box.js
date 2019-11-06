import React from 'react';
import Grid from '@material-ui/core/Grid';
import {GameCard} from '../games';
import '../utils/layout.css';

const GameResultsBox = props => (
  <section className="large-margin">
  	<Grid container>
	    {props.games.map(game => {
	      return (
	        <GameCard key={game.gbId} game={game} />
	      );
	    })}
	  </Grid>
  </section>
);

export default GameResultsBox;
