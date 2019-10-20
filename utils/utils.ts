// npm
import express from 'express';
import {ValidatorResult, Validator, Schema} from 'jsonschema';
import {User, List} from '../models';

const validator: Validator = new Validator()

export const validateRequest: Function = (
  req: express.Request,
  resp: express.Response,
  next: express.NextFunction,
  schema: Schema
): void => {
  const validResult: ValidatorResult = validator.validate(req.body, schema);
  console.log(validResult.toString());
  if (validResult.valid) next();
  else resp.status(400).send('Invalid request: ' + validResult.errors);
};

