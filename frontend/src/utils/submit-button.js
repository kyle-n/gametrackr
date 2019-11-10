import React from 'react';
import Button from '@material-ui/core/Button';

const SubmitButton = props => (
  <Button variant="contained"
          color="primary"
          startIcon={(<props.icon />)}
          size="large"
          type="submit"
          onClick={props.submit}
          disabled={props.disabled}
  >
    {props.value}
  </Button>
);

export default SubmitButton;
