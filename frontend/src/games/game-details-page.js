import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import '../utils/layout.css';
import {PageTitle} from '../utils';

const GameDetailsPage = props => {
	return props.game && props.game.description ? (
			<GameDetails game={props.game} />
		) : (
			<GamePageLoadingSpinner />
		);
}

const GameDetails = props => {
	return (
		<article>
			<PageTitle title={props.game.name} />
			<div dangerouslySetInnerHTML={{__html: props.game.description}}></div>
		</article>
	);
};

const GamePageLoadingSpinner = () => (
			<div style={{textAlign: 'center'}} className="large-margin">
					<CircularProgress color="secondary"
														size="10%" />
			</div>
);

export default GameDetailsPage;
