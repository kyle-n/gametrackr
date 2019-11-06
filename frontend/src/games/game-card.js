import React from 'react';
import Grow from '@material-ui/core/Grow';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
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
            <Grid container>
              <Grid item xs={12} sm={6}>
                {props.game.description ? (
                  <Button size="small" color="secondary">
                    Details
                  </Button>
                ) : null}
              </Grid>
              <Grid item xs={12} sm={6} style={{textAlign: 'right'}}>
                <Button size="small" color="secondary">
                  Add to list
                </Button>
              </Grid>
            </Grid>
          </CardActions>
        </Card>
      </Grow>
    </Grid>
  );
};

export default GameCard;
