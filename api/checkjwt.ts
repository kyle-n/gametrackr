import express from 'express';
import jwt from 'jsonwebtoken';
import { DecodedToken } from '../schemas';

export const checkJwt = (req: express.Request, resp: express.Response, next: express.NextFunction): void | express.Response => {
  if (req.method === 'OPTIONS') return next();
  if (req.headers.authorization && req.headers.authorization.indexOf(' ') !== -1) {
    const token: string = req.headers.authorization.split(' ')[1];
    let decoded: DecodedToken;
    try { decoded = <DecodedToken>jwt.verify(token, <string>process.env.SECRET_KEY); }
    catch (e) {
      console.log(req.method, req.path);
      console.log(token, 'in middleware');
      return resp.status(401).send('Invalid login token');
    }
    if (decoded && decoded.id) {
      resp.locals.id = decoded.id;
      resp.locals.email = decoded.email;
      return next();
    } else return resp.status(401).send('Please log in again');
  } else return resp.status(401).send('You must be logged in to do that');
};
