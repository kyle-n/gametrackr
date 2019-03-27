import React from 'react';

const GameResultCard = props => {
  if (!Object.keys(props).length) props.game = {};
  console.log(props);
  return (
    <div className="card">
      <div className="card-image">
        <img src={props.game.image} alt={props.game.name} />
        <span className="card-title z-depth-2">{props.game.name}</span>
        <a className="btn-floating halfway-fab waves-effect waves-light blue lighten-1">
          <i className="material-icons">add</i>
        </a>
      </div>
      <div className="card-content">
        <p>{props.game.deck}</p>
      </div>
    </div>
  );
};

export default GameResultCard;
