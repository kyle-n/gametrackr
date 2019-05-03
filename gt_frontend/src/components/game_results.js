import React from 'react';
import { connect } from 'react-redux';
import GameResultCard from './game_result_card';
import { addGameToList } from '../reducers/actions';

const mapStateToProps = state => {
  const lists = [];
  for (const [key, id] of Object.entries(state.userLists)) {
    lists.push(id);
  };
  return {
    results: state.results.map(id => state.entities.games[id]),
    lists
  };
}

const GameResults = props => {
  let resultsMarkup = null;
  if (props.results && props.results.length && props.small) resultsMarkup = props.results.map(game => {
    return (<GameResult key={game.id} id={game.id} name={game.name} date={game.original_release_date} />);
  });
  if (props.results && props.results.length && props.large) resultsMarkup = props.results.map(game => {
    return (<GameResultCard key={game.id} game={game} lists={props.lists} 
      addToList={props.addGameToList.bind(this, game.id)} />);
  });
  return (
    <div className={props.small ? 'collection' : ''}>
      {resultsMarkup}
    </div>
  );
}

const GameResult = props => (
  <a href="#" onClick={props.action}>
    <div className="row collection-item blue lighten-1 white-text">
      <div className="col s8">{props.name}</div>
      <div className="col s4 right-align">{props.date}</div>
    </div>
  </a>
);

export default connect(mapStateToProps, { addGameToList })(GameResults);
