import React from 'react';
import { connect } from 'react-redux';

const mapStateToProps = state => {
  return {
    results: state.results.map(id => state.entities.games[id])
  };
}

const GameResults = props => {
  let resultsMarkup = null;
  if (props.results.length) resultsMarkup = props.results.map(game => {
    return (<GameResult key={game.id} id={game.id} name={game.name} date={game.original_release_date} />);
  });
  return (
    <div className="collection">
      {resultsMarkup}
    </div>
  );
}

const GameResult = props => (
  <a href="#" onClick={props.action}>
    <div className="row">
      <div className="col s8">{props.name}</div>
      <div className="col s4">{props.date}</div>
    </div>
  </a>
);

export default connect(mapStateToProps, {})(GameResults);
