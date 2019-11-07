import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import '../utils/layout.css';

const GameDetailsPage = props => {
	return props.game && props.game.description ? (
			<article>
				{props.game.description}
			</article>
		) : (
			<div style={{textAlign: 'center'}} className="large-margin">
					<CircularProgress color="secondary"
														size="10%" />
			</div>
		);
	}

export default GameDetailsPage;
