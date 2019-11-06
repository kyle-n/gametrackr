import React from 'react';
import {GameCard} from '../games';
import '../utils/layout.css';

const GameResultsBox = props => (
  <section className="large-margin">
    {props.games.map(game => {
      return (
        <GameCard key={game.gbId} game={game} />
      );
    })}
  </section>
);

export default GameResultsBox;
