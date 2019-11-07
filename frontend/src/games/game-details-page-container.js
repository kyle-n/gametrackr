import React from 'react';
import {withRouter} from 'react-router-dom';
import GameDetailsPage from './game-details-page';
import {getGame} from '../external-connectors';

class GameDetailsPageContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {game: null}
	}

	async componentDidMount() {
		const game = await getGame(this.props.match.params.id);
		this.setState({game});
	}

	render() {
		console.log(this.state.game)
		return (
			<GameDetailsPage game={this.state.game} />
		);
	}
}

export default withRouter(GameDetailsPageContainer);
