import React from 'react';
import Grow from '@material-ui/core/Grow';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import CardActions from '@material-ui/core/CardActions';
import {gamePropsToDate} from '../utils';

const GameCard = props => (
  <Grow in>
    <Card>
      <CardHeader title={props.game.name}
                  subheader={gamePropsToDate(props.game).toDateString()}
      >
      </CardHeader>
      <CardMedia image="https://material-ui.com/static/images/cards/paella.jpg"
                 title={props.game.name}
      />
      <CardContent>
        {props.game.deck}
      </CardContent>
      <CardActions>
      </CardActions>
    </Card>
  </Grow>
);

export default GameCard;
