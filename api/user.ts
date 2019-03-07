import express from 'express';
import { objectEmpty } from '../utils';
import { User, ServerError } from '../schemas';
import { Client } from 'pg';
import { connectionUrl } from '../db';
import bcrypt from 'bcrypt';

const client: Client = new Client(connectionUrl);
client.connect();
const defaultError: ServerError = { status: 500, msg: 'Internal server error' };

export const validEmail = (addr: string) => /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(addr);
export const validPassword = (pw: string) => /^(?=.*\d).{6,}$/gi.test(pw);

export const validateUser = (body: any, needBoth: boolean): Promise<ServerError> => {
  let error: ServerError = { status: 200, msg: '' };
  if (objectEmpty(body)) error = { status: 400, msg: 'Must provide an email address and password' };
  if (needBoth && (!body.email || !validEmail(body.email))) error = { status: 400, msg: 'Must provide an email address' };
  if (needBoth && (!body.password || !validPassword(body.password))) error = { status: 400, msg: 'Must provide a password' };
  if (error.msg) return new Promise((resolve, reject) => reject(error));
  else return new Promise((resolve, reject) => {
    client.query('SELECT id FROM users WHERE email = $1;', [body.email]).then(data => {
      if (data.rowCount) {
        error = { status: 409, msg: 'Email address is already taken' };
        reject(error);
      }
      else resolve(error);
    });
  });
}

export const createUser = (req: express.Request, resp: express.Response): number => {
  validateUser(req.body, true).then(() => {
    return bcrypt.hash(req.body.password, 10);
  }).then(hashed => {
    return client.query(`INSERT INTO users (email, password) VALUES ($1, $1) RETURNING id;`, [req.body.email, hashed]);
  }).then(data => {
    return client.query('INSERT INTO list_metadata (user_id, list_table_name, title) VALUES ($1, $2, $3) RETURNING list_table_name;', [data.rows[0].id, Date.now(), 'Played games']);
  }).then(data => {
    return client.query('CREATE TABLE $1 (id SERIAL PRIMARY KEY, ranking INTEGER, game_id INTEGER, text TEXT);', [data.rows[0].list_table_name]);
  }).then(() => {
    return resp.status(200).send();
  }).catch(e => {
    if (e.msg) resp.status(e.status).send(e.msg);
    else resp.status(defaultError.status).send(defaultError.msg);
  });

  return 0;
};

export const readUser = (req: express.Request, resp: express.Response): number => {
  let error: ServerError = { ...defaultError };
  client.query('SELECT (id, email, confirmed) FROM users WHERE id = $1;', [resp.locals.id]).then(data => {
    if (!data.rowCount) {
      error = { status: 404, msg: 'User profile with that ID not found'};
      throw new Error();
    }
    resp.status(200).json(data.rows[0]);
  }).catch(() => resp.status(error.status).send(error.msg));
  return 0;
};

export const updateUser = (req: express.Request, resp: express.Response): number => {
  return 0;
};

export const deleteUser = (req: express.Request, resp: express.Response): number => {
  return 0;
};

export const router: express.Router = express.Router();
router.post('/', createUser);
router.route('/:userId').get(readUser)
                        .put(updateUser)
                        .delete(deleteUser);
