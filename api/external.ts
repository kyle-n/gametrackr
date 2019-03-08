import express from 'express';
import jwt from 'jsonwebtoken';
import { ServerError, User, DecodedToken } from '../schemas';
import { client } from '../db';
import bcrypt from 'bcrypt';
import { validEmail, validPassword } from './user';
import { nameList } from '../utils';

export const router: express.Router = express.Router();
const defaultError: ServerError = { status: 500, msg: 'Internal server error' };

export const validateNewUser = (body: any): Promise<ServerError> => {
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
  let newUser: DecodedToken;
  validateNewUser(req.body).then(() => {
    return bcrypt.hash(req.body.password, 10);
  }).then(hashed => {
    return client.query(`INSERT INTO users (email, password, confirmed) VALUES ($1, $2, $3) RETURNING id;`, [req.body.email, hashed, false]);
  }).then(rows => {
    newUser = { id: rows[0].id, email: req.body.email };
    return client.query('INSERT INTO list_metadata (user_id, list_table_name, title) VALUES ($1, $2, $3) RETURNING list_table_name;', [rows[0].id, nameList(), 'Played games']);
  }).then(rows => {
    return client.query('CREATE TABLE $1~ (id SERIAL PRIMARY KEY, ranking INTEGER, game_id INTEGER, text TEXT);', [rows[0].list_table_name]);
  }).then(() => {
    const newToken = jwt.sign(newUser, <string>process.env.SECRET_KEY);
    resp.status(200).json({ token: newToken });
  }).catch(e => {
    if (e.msg) resp.status(e.status).json(e.msg);
    else resp.status(defaultError.status).send(defaultError.msg);
  });

  return 0;
};

const login = (req: express.Request, resp: express.Response) => {
  if (!req.body.email || !req.body.password) return resp.status(400).send('Must provide a username and password');
  let error: ServerError = { ...defaultError };
  let profile: User;
  client.query('SELECT id, password FROM users WHERE email = $1;', req.body.email).then(rows => {
    if (!rows.length) {
      error = { status: 404, msg: 'Cannot find an account for the requested email address' };
      throw new Error();
    }
    profile = rows[0];
    return bcrypt.compare(req.body.password, profile.password);
  }).then(pwMatch => {
    if (!pwMatch) {
      error = { status: 403, msg: 'Incorrect password' };
      throw new Error();
    }
    const token = jwt.sign({ id: profile.id, email: req.body.email }, <string>process.env.SECRET_KEY);
    return resp.status(200).json({ token });
  }).catch(() => resp.status(error.status).send(error.msg));
}

router.post('/login', login);
