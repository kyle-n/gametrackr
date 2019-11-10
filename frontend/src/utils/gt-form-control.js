import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import {upperCaseFirstLetter} from './helpers';

const GtFormControl = props => {
  const fcId = props.idPrefix + '-' + props.formControl.label;
  return (
    <FormControl fullWidth>
      <InputLabel htmlFor={fcId}>
        {upperCaseFirstLetter(props.formControl.label)}
      </InputLabel>
      <Input type={props.formControl.type}
             name={props.formControl.label}
             id={fcId}
             inputProps={props.formControl.inputProps}
             value={props.value}
             onChange={props.onChange}
      />
    </FormControl>
  );
};

export default GtFormControl;
