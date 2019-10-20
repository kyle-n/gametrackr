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

interface PublicUserData {
  id: number;
  name: string;
  email?: string;
  createdAt: string;
}

export const getPublicUserData: Function = (user: User, returnEmail?: boolean): PublicUserData => {
  const publicData: PublicUserData = {
    id: user.id,
    name: user.name,
    createdAt: user.createdAt
  };
  if (returnEmail) publicData.email = user.email;
  return publicData;
}

interface PublicListData {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
  userName?: string;
}

export const getPublicListData: Function = (list: List, user?: User): PublicListData => {
  const publicData: PublicListData = {
    id: list.id,
    title: list.title,
    createdAt: list.createdAt,
    updatedAt: list.updatedAt,
  };
  if (user) publicData.userName = user.name;
  return publicData;
}
