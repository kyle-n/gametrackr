import React from 'react';
import ListCard from './list-card';
import Grid from '@material-ui/core/Grid';

const ListResults = props => (
  <Grid container>
    {props.lists.map(list => {
      return (
        <Grid item key={list.id}
              xs={12} md={6} lg={4} xl={3}>
          <ListCard list={list}
                    onDelete={props.onDelete} />
        </Grid>
      );
    })}
  </Grid>
);

export default ListResults;
