import React from 'react';
import {GameCard} from '../games';

const GameResultsBox = props => (
  <section>
    {props.games.map(game => {
      return (
        <GameCard key={game.gbId} game={game} />
      );
    })}
  </section>
);

export default GameResultsBox;
