import React from 'react';

const ListResults = props => {
  return props.lists.map(list => {
    return (
      <p key={list.id}>{list.title}</p>
    );
  })
};

export default ListResults;
