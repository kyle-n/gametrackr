import React from 'react';
import Typography from '@material-ui/core/Typography';

const PageTitle = props => (
  <Typography variant="h3" variantMapping={{h3: 'h2'}}>
    {props.title}
  </Typography>
);

export default PageTitle;
