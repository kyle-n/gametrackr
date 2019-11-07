import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import '../utils/layout.css';
import GameCard from './game-card';

const GameDetailsPage = props => {
	return props.game && props.game.description ? (
			<GameDetails game={props.game} />
		) : (
			<GamePageLoadingSpinner />
		);
}

const GameDetails = props => (
	<div>
		<Hidden mdUp>
			<MobileLayout game={props.game} />
		</Hidden>
		<Hidden smDown>
			<DesktopLayout game={props.game} />
		</Hidden>
	</div>
);

const MobileLayout = props => (
	<Grid container>
		<Grid item xs={12}>
			<GameCard game={props.game} />
		</Grid>
		<Grid item xs={12}>
			<GameDetailsArticle game={props.game} />
		</Grid>
	</Grid>
);

const DesktopLayout = props => (
	<Grid container>
		<Grid item md={8}>
			<GameDetailsArticle game={props.game} />
		</Grid>
		<Grid item md={4}>
			<GameCard game={props.game} />
		</Grid>
	</Grid>
);

const GameDetailsArticle = props => {
	const convertedDescription = props.game.description
		.replace(/<a/g, '<a class="reset-color"');
	console.log(convertedDescription, props.game.description)
	return (
		<article style={{overflow: 'hidden'}}>
			<div dangerouslySetInnerHTML={{__html: convertedDescription}}>
			</div>
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
