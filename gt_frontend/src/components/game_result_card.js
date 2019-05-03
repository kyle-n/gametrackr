import React, { Component } from 'react';
import M from 'materialize-css/dist/js/materialize.min';
import PropTypes from 'prop-types';

class GameResultCard extends Component {
  constructor(props) {
    super(props);
    this.ddId = `dropdown-button-${this.props.game.id}`;
  }
  componentDidMount() {
    const btn = document.querySelector(`#${this.ddId}`);
    this.dropdown = M.Dropdown.init(btn, { alignment: 'right' });
  }
  render() {
    return (
      <div className="card black">
        <div className="card-image">
          <img src={this.props.game.image} alt={this.props.game.name} />
          <DropdownButtonAndList lists={this.props.lists} gameId={this.props.game.id} ddId={this.ddId}
           addToList={this.props.addToList} />
        </div>
        <div className="card-content">
          <span className="card-title">{this.props.game.name}</span>
          <p>{this.props.game.deck}</p>
        </div>
      </div>
    );
  }
}

GameResultCard.propTypes = {
  game: PropTypes.object.isRequired,
  lists: PropTypes.array.isRequired,
  addToList: PropTypes.func.isRequired
};

const DropdownButtonAndList = props => {
  const collectionMarkup = props.lists.map(list => {
      return (<ListForAdd key={list.id} id={list.id} addToList={props.addToList} title={list.title} />);
  });
  const dropdownName = `dropdown-collection-${props.gameId}`;
  return (
    <div>
      <a id={props.ddId} data-target={dropdownName} className="btn-floating halfway-fab waves-effect waves-light blue lighten-1 dropdown-trigger">
        <i className="material-icons">add</i>
      </a>
      <ul id={dropdownName} className="dropdown-content">
        {collectionMarkup}
      </ul>
    </div>
  );
}

const ListForAdd = props => (
  <div key={props.id} onClick={() => props.addToList(props.id)} className="collection-item">
    {props.title}
  </div>
);

export default GameResultCard;
