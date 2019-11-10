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
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

const ListCard = props => {
  const cardId = 'list-' + props.list.id;
  let subheader;
  if (props.list.updatedAt) subheader = 'Updated at ' + props.list.updatedAt.toDateString();
  else if (props.list.createdAt) subheader = 'Created at ' + props.list.createdAt.toDateString();
  return (
    <Grow in>
      <Box margin="1rem">
        <Card>
          <CardHeader title={props.list.title}
                      subheader={subheader} />
          <CardContent>
            <Typography variant="body1">
              {props.list.deck}
            </Typography>
          </CardContent>
          <CardActions>
            <Grid container>
              <ViewLink />
              <ListActionIcon icon={EditIcon} />
              <ListActionIcon icon={DeleteIcon} />
            </Grid>
          </CardActions>
        </Card>
      </Box>
    </Grow>
  );
};

const ViewLink = props => (
  <Grid item xs={8} sm={10}>
    <Button size="large" color="secondary">
      View
    </Button>
  </Grid>
);

const ListActionIcon = props => (
  <Grid item xs={2} sm={1} style={{textAlign: 'center'}}>
    <IconButton>
      <props.icon />
    </IconButton>
  </Grid>
);

export default ListCard;
