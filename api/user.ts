import express from 'express';
import { objectEmpty } from '../utils';
import { User, ServerError } from '../schemas';
import { Client } from 'pg';
import { connectionUrl } from '../db';

const client: Client = new Client(connectionUrl);
client.connect();

export const validEmail = (addr: string) => /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(addr);
export const validPassword = (pw: string) => /^(?=.*\d).{6,}$/gi.test(pw);

export const validateUser = (body: any): Promise<string> => {
  let status: string = '';
  if (objectEmpty(body)) status = 'missing both';
  if (!body.email || !validEmail(body.email)) status = 'missing email';
  if (!body.password || !validPassword(body.password)) status = 'missing password';
  if (status) return new Promise((resolve, reject) => reject(status));
  else return new Promise((resolve, reject) => {
    client.query('SELECT id FROM users WHERE email = $1;', [body.email]).then(data => {
      if (data.rowCount) reject(status);
      else resolve(status);
    });
  });
}

export const createUser = (req: express.Request, resp: express.Response): number => {

  // check profile data
  if (objectEmpty(req.body)) {
    resp.status(400).send('Must provide an email address and password');
    return 1;
  }
  if (!req.body.email) {
    resp.status(400).send('Must provide an email address');
    return 1;
  }
  if (!req.body.password) {
    resp.status(400).send('Must provide a password');
  }


  return 0;
};

export const readUser = (req: express.Request, resp: express.Response): number => {
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
