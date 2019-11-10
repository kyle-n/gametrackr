import React from 'react';
import Grow from '@material-ui/core/Grow';
import Hidden from '@material-ui/core/Hidden';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import LoginFormContainer from './login-form-container';

const LoginDropdown = props => (
  <Hidden smDown>
    <Grow in style={{transformOrigin: 'top left'}}>
      <Box position="absolute"
          mt="0.5rem">
        <Box position="relative"
            zIndex="1"
            minWidth="20rem">
          <LoginFormCard onLogin={props.onLogin} />
        </Box>
      </Box>
    </Grow>
  </Hidden>
);

const LoginFormCard = props => (
  <Card>
    <CardContent>
      <LoginFormContainer onLogin={props.onLogin} />
    </CardContent>
  </Card>
);

export default LoginDropdown;
