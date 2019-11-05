import React from 'react';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

export const Footer = props => (
  <footer style={{textAlign: 'center'}}>
    <Grid container justify="center">
      <Grid item xs={6}>
        <Divider style={{margin: '3rem 0 1rem 0'}} />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="p">
          Made by <a href="https://www.kylenazario.com/" target="_blank" className="reset-color">Kyle Nazario</a>.
          See the <a href="https://github.com/kyle-n/gametrackr" target="_blank" className="reset-color">source code</a>.
        </Typography>
      </Grid>
    </Grid>
  </footer>
);
