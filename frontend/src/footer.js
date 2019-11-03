import React from 'react';
import {Divider, Grid} from '@material-ui/core';

export const Footer = props => (
  <footer style={{marginTop: '3rem', textAlign: 'center'}}>
    <Grid container justify="center">
      <Grid item xs={6}>
        <Divider />
      </Grid>
      <Grid item xs={12}>
        <p>
          Made by <a href="https://www.kylenazario.com/" target="_blank" className="reset-color">Kyle Nazario</a>.
          See the <a href="https://github.com/kyle-n/gametrackr" target="_blank" className="reset-color">source code</a>.
        </p>
      </Grid>
    </Grid>
  </footer>
);
