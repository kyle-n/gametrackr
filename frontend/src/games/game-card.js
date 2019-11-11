import React from 'react';
import Grow from '@material-ui/core/Grow';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import {Link} from 'react-router-dom';
import {gamePropsToDate} from '../utils';
import './game-card.css';
import '../utils/layout.css';

const GameCard = props => {
  return (
    <Grow in>
      <Card className="small-margin">
        <CardHeader title={props.game.name}
                    subheader={gamePropsToDate(props.game).toDateString()}
        />
        <CardMedia image={props.game.image}
                    title={props.game.name}
                    className="card-image"
        />
        <CardContent>
          {props.game.deck}
        </CardContent>
        <CardActions>
          <GameCardActions game={props.game} />
        </CardActions>
      </Card>
    </Grow>
  );
};

const GameCardActions = props => (
  <Grid container>
    <Grid item xs={12} sm={6}>
      {props.game.description ? (
        <LinkToDescription game={props.game} />
      ) : null}
    </Grid>
    <Grid item xs={12} sm={6} style={{textAlign: 'right'}}>
        <AddToList />
    </Grid>
  </Grid>
);

const LinkToDescription = props => (
  <Link to={`/games/${props.game.gbId}/details`}>
    <Button size="small" color="secondary">
      Details
    </Button>
  </Link>
);

const AddToList = props => (
  <Button size="small" color="secondary">
    Add to list
  </Button>
);

export default GameCard;
