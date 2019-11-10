import React from 'react';
import ListCard from './list-card';

const ListResults = props => {
  return props.lists.map(list => {
    return (
      <ListCard key={list.id} list={list} />
    );
  });
};

export default ListResults;
