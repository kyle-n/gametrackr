import express from 'express';
import { nameList } from '../utils';
import { User, ServerError } from '../schemas';
import { client } from '../db';
import bcrypt from 'bcrypt';

const defaultError: ServerError = { status: 500, msg: 'Internal server error' };

export const validEmail = (addr: string) => /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(addr);
export const validPassword = (pw: string) => /^(?=.*\d).{6,}$/gi.test(pw);

export const validateUser = (body: any, needBoth: boolean): Promise<ServerError> => {
  let error: ServerError = { status: 200, msg: '' };
  let missingEmail = false, missingPw = false, invalidEmail = false, invalidPw = false, emailTaken = false;
  if (!body.email) missingEmail = true;
  if (!body.password) missingPw = true;
  if (!validEmail(body.email)) invalidEmail = true;
  if (!validPassword(body.password)) invalidPw = true;

  return new Promise<ServerError>((resolve, reject) => {
    let addr = 'none';
    if (!missingEmail && !invalidEmail) addr = body.email;
    client.query('SELECT id FROM users WHERE email = $1;', [addr]).then(rows => {
      if (rows.length) emailTaken = true;

      if (emailTaken) return reject({ status: 409, msg: 'Email address is already taken' });
      if (missingEmail && missingPw) return reject({ status: 400, msg: 'Must provide an email address and password' });
      else if (missingEmail) return reject({ status: 400, msg: 'Must provide an email address' });
      else if (missingPw) return reject({ status: 400, msg: 'Must provide a password' })
      else if (invalidEmail && invalidPw) return reject({ status: 400, msg: 'Must provide a valid email and password' });
      else if (invalidEmail) return reject({ status: 400, msg: 'Must provide a valid email address' });
      else if (invalidPw) return reject({ status: 400, msg: 'Must provide a valid password' });
      else resolve({ status: 200, msg: '' });
    });
  });
}

export const createUser = (req: express.Request, resp: express.Response): number => {
  validateUser(req.body, true).then(() => {
    return bcrypt.hash(req.body.password, 10);
  }).then(hashed => {
    return client.query(`INSERT INTO users (email, password, confirmed) VALUES ($1, $2, $3) RETURNING id;`, [req.body.email, hashed, false]);
  }).then(rows => {
    return client.query('INSERT INTO list_metadata (user_id, list_table_name, title) VALUES ($1, $2, $3) RETURNING list_table_name;', [rows[0].id, nameList(), 'Played games']);
  }).then(rows => {
    return client.query('CREATE TABLE $1~ (id SERIAL PRIMARY KEY, ranking INTEGER, game_id INTEGER, text TEXT);', [rows[0].list_table_name]);
  }).then(() => {
    return resp.status(200).send();
  }).catch(e => {
    //console.log(e, 'CREATE ERR');
    if (e.msg) resp.status(e.status).send(e.msg);
    else resp.status(defaultError.status).send(defaultError.msg);
  });

  return 0;
};

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

export const updateUser = (req: express.Request, resp: express.Response): number => {
  const uId: number = parseInt(req.params.userId);
  let error: ServerError = { ...defaultError };
  validateUser(req.body, false).then(() => {
    if (req.body.password) return bcrypt.hash(req.body.password, 10);
    else return new Promise<string>(resolve => resolve(''));
  }).then(hashed => {
    if (req.body.email && !hashed) return client.query('UPDATE users SET (email = $1, confirmed = false) WHERE id = $2;', [req.body.email, uId]);
    else if (!req.body.email && hashed) return client.query('UPDATE users SET password = $1 WHERE id = $2;', [hashed, uId]);
    else return client.query('UPDATE users SET (email = $1, password = $2, confirmed = false WHERE id = $3;', [req.body.email, hashed, uId]);
  }).then(() => resp.status(200).send())
  .catch(e => {
    if (e.msg) resp.status(e.status).send(e.msg);
    else resp.status(error.status).send(error.msg);
  });

  return 0;
};

export const deleteUser = (req: express.Request, resp: express.Response): number => {
  const uId: number = parseInt(resp.locals.id);
  client.query('DELETE FROM users WHERE id = $1;', [uId]).then(() => {
    return client.query('DELETE FROM list_metadata WHERE user_id = $1 RETURNING list_table_name;', [uId]);
  }).then(rows => {
    for (let i = 0; i < rows.length; i++) {
      client.query('DROP TABLE IF EXISTS $1;', [rows[i].list_table_name]).then(() => {
        if (i === rows.length - 1) return resp.status(200).send();
      });
    }
  }).catch(() => resp.status(defaultError.status).send(defaultError.msg));

  return 0;
};

const fourHundredNotSpecified = (req: express.Request, resp: express.Response) => resp.status(400).send('Request /api/users/user_id, not /api/users');

export const router: express.Router = express.Router();
router.route('/').get(fourHundredNotSpecified)
                 .post(createUser)
                 .put(fourHundredNotSpecified)
                 .delete(fourHundredNotSpecified);
router.route('/:userId').get(readUser)
                        .put(updateUser)
                        .delete(deleteUser);
