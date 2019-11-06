import React from 'react';
import Grow from '@material-ui/core/Grow';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import CardActions from '@material-ui/core/CardActions';
import {makeStyles} from '@material-ui/core/styles';
import {gamePropsToDate} from '../utils';
import './game-card.css';
import '../utils/layout.css';

const GameCard = props => {
  return (
    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
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
            <p>actions</p>
          </CardActions>
        </Card>
      </Grow>
    </Grid>
  );
};

export default GameCard;
