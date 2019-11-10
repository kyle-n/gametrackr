import React from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

const PageTitle = props => (
  <Box marginBottom="2rem">
    <Typography variant="h3" variantMapping={{h3: 'h2'}}>
      {props.title}
    </Typography>
  </Box>
);

export default PageTitle;
