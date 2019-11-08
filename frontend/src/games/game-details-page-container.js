import React from 'react';
import {withRouter} from 'react-router-dom';
import GameDetailsPage from './game-details-page';
import {getGame} from '../external-connectors';
import {sendAlert} from '../redux';
import {connect} from 'react-redux';

class GameDetailsPageContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {game: null}
	}

	componentDidMount() {
		getGame(this.props.match.params.id).then(game => {
			if (!game) return this.props.sendAlert('Could not load game details', 'error');
			this.setState({game});
		});
	}

	render() {
		return (
			<GameDetailsPage game={this.state.game} />
		);
	}
}

const dispatchMaps = {sendAlert};

export default withRouter(connect(null, dispatchMaps)(GameDetailsPageContainer));
