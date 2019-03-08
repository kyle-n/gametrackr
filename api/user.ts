import express from 'express';
import { nameList } from '../utils';
import { User, ServerError, DecodedToken } from '../schemas';
import { client } from '../db';
import bcrypt from 'bcrypt';
import { checkJwt } from './checkjwt';
import jwt from 'jsonwebtoken';

const defaultError: ServerError = { status: 500, msg: 'Internal server error' };

export const validEmail = (addr: string) => /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(addr);
export const validPassword = (pw: string) => /^(?=.*\d).{6,}$/gi.test(pw);

export const readUser = (req: express.Request, resp: express.Response): number => {
  let error: ServerError = { ...defaultError };

  // temp code until I make middleware to set resp.locals.id from JWT
  resp.locals.id = parseInt(req.params.userId);

  client.query('SELECT id, email, confirmed FROM users WHERE id = $1;', [resp.locals.id]).then(rows => {
    if (!rows.length) {
      error = { status: 404, msg: 'User profile with that ID not found'};
      throw new Error();
    }
    resp.status(200).json(rows[0]);
  }).catch(() => resp.status(error.status).send(error.msg));
  return 0;
};

const validateUserUpdate = (body: any, reqId: number, paramId: number): Promise<ServerError> => {
  let missingBoth = false, invalidEmail = false, invalidPw = false, invalidBoth = false;
  if (!body.email && !body.password) missingBoth = true;
  if (body.email && !validEmail(body.email) && body.password && !validPassword(body.password)) invalidBoth = true;
  if (body.email && !validEmail(body.email)) invalidEmail = true;
  if (body.password && !validPassword(body.password)) invalidPw = true;

  return new Promise<ServerError>((resolve, reject) => {
    if (reqId !== paramId) return reject({ error: 403, msg: 'Cannot update someone else\'s profile' });
    client.query('SELECT id FROM users WHERE id = $1;', [reqId]).then(rows => {
      if (!rows.length) return reject({ status: 404, msg: 'User profile with that ID not found' });
      if (missingBoth) return reject({ status: 400, msg: 'Must provide an update to the email or password' });
      if (invalidBoth) return reject({ status: 400, msg: 'Must provide a valid new email and password' });
      if (invalidEmail) return reject({ status: 400, msg: 'Must provide a valid new email' });
      if (invalidPw) return reject({ status: 400, msg: 'Must provide a valid new password' });
      return resolve({ status: 200, msg: '' });
    });
  });
}

export const updateUser = (req: express.Request, resp: express.Response): number => {
  const uId: number = parseInt(req.params.userId);
  let error: ServerError = { ...defaultError };
  resp.locals.id = parseInt(req.params.userId);
  validateUserUpdate(req.body, resp.locals.id, parseInt(req.params.userId)).then(() => {
    if (req.body.password) return bcrypt.hash(req.body.password, 10);
    else return new Promise<string>(resolve => resolve(''));
  }).then(hashed => {
    if (req.body.email && !hashed) return client.query('UPDATE users SET email = $1, confirmed = false WHERE id = $2;', [req.body.email, uId]);
    else if (!req.body.email && hashed) return client.query('UPDATE users SET password = $1 WHERE id = $2;', [hashed, uId]);
    else return client.query('UPDATE users SET email = $1, password = $2, confirmed = false WHERE id = $3;', [req.body.email, hashed, uId]);
  }).then(() => resp.status(200).send())
  .catch(e => {
    if (e.msg) error = { ...e };
    resp.status(error.status).send(error.msg);
  });

  return 0;
};

export const deleteUser = (req: express.Request, resp: express.Response): number => {
  resp.locals.id = parseInt(req.params.userId);
  const uId: number = resp.locals.id;
  let error: ServerError = { ...defaultError };
  client.query('DELETE FROM users WHERE id = $1 RETURNING id;', [uId]).then(rows => {
    if (!rows.length) {
      error = { status: 404, msg: 'User profile with that ID not found' };
      throw new Error();
    }
    return client.query('DELETE FROM list_metadata WHERE user_id = $1 RETURNING list_table_name;', [uId]);
  }).then(rows => {
    for (let i = 0; i < rows.length; i++) {
      client.query('DROP TABLE IF EXISTS $1~;', [rows[i].list_table_name]).then(() => {
        if (i === rows.length - 1) return resp.status(200).send();
      });
    }
  }).catch(() => resp.status(error.status).send(error.msg));

  return 0;
};

const fourHundredNotSpecified = (req: express.Request, resp: express.Response) => resp.status(400).send('Request /api/users/user_id, not /api/users');

export const router: express.Router = express.Router();
router.route('/').get(fourHundredNotSpecified)
                 .put(fourHundredNotSpecified)
                 .delete(fourHundredNotSpecified);
router.route('/:userId').get(readUser)
                        .put(updateUser)
                        .delete(deleteUser);
