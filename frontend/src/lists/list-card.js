import React from 'react';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Grow from '@material-ui/core/Grow';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import {Link} from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import {DeleteIconButton} from '../utils';

const ListCard = props => {
  const cardId = 'list-' + props.list.id;
  return (
    <Grow in>
      <Box margin="1rem" padding="0.5rem">
        <Card id={cardId}>
          <ListHeader list={props.list} />
          {props.list.deck ? (
            <ListDeck text={props.list.deck} />
          ) : null}
          <ListActions list={props.list}
                       onDelete={props.onDelete}/>
        </Card>
      </Box>
    </Grow>
  );
};

const ListHeader = props => {
  let subheader = null;
  if (props.list.updatedAt) subheader = 'Updated at ' + props.list.updatedAt.toDateString();
  else if (props.list.createdAt) subheader = 'Created at ' + props.list.createdAt.toDateString();

  return (<CardHeader title={props.list.title}
                      subheader={subheader} />
  );
};

const ListDeck = props => (
  <CardContent>
    <Typography variant="body1">
      {props.text}
    </Typography>
  </CardContent>
);

const ListActions = props => (
  <CardActions>
    <Grid container>
      <ViewLink listId={props.list.id} />
      <EditIconButton listId={props.list.id} />
      <DeleteIconButtonArea listId={props.list.id} onDelete={props.onDelete} />
    </Grid>
  </CardActions>
);

const ViewLink = props => (
  <Grid item xs={8}>
    <Link to={`/lists/${props.listId}`}>
      <Button size="large" color="secondary">
        View
      </Button>
    </Link>
  </Grid>
);

const EditIconButton = props => (
  <Grid item xs={2} style={{textAlign: 'center'}}>
    <Link to={`/lists/${props.listId}/edit`}>
      <IconButton>
        <EditIcon />
      </IconButton>
    </Link>
  </Grid>
);

const DeleteIconButtonArea = props => (
  <Grid item xs={2} style={{textAlign: 'center'}}>
    <DeleteIconButton entityType="list"
                      entityId={props.listId}
                      onConfirm={() => props.onDelete(props.listId)} />
  </Grid>
)

export default ListCard;
