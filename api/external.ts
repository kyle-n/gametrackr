import express from 'express';
import jwt from 'jsonwebtoken';
import { ServerError, User, DecodedToken } from '../schemas';
import { client } from '../db';
import bcrypt from 'bcrypt';
import { createUser } from './user';

export const router: express.Router = express.Router();
const defaultError: ServerError = { status: 500, msg: 'Internal server error' };

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
    return resp.status(200).json({ token, email: req.body.email, id: profile.id });
  }).catch(() => resp.status(error.status).send(error.msg));
}

router.route('/login').post(login);
router.route('/').post(createUser);
