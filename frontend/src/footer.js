import React from 'react';
import {Grid} from '@material-ui/core';

export const Footer = props => (
  <footer>
    <Grid container justify="center">
      <Grid item xs={12} md={6}>
        <p>
          Made by <a href="https://www.kylenazario.com/" className="reset-color">Kyle Nazario</a>.
          See the <a href="https://github.com/kyle-n/gametrackr" className="reset-color">source code</a>.
        </p>
      </Grid>
    </Grid>
  </footer>
);
