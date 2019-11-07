import React from 'react';
import Grid from '@material-ui/core/Grid';
import {GameCard} from '../games';
import '../utils/layout.css';

const GameResultsBox = props => (
  <section className="large-margin">
  	<Grid container>
	    {props.games.map(game => {
	      return (
					<Grid item key={game.gbId} xs={12} sm={6} md={4} lg={3} xl={2}>
						<GameCard game={game} />
					</Grid>
	      );
	    })}
	  </Grid>
  </section>
);

export default GameResultsBox;
