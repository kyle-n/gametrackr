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
};

const checkEmail = async (req: express.Request, resp: express.Response): Promise<express.Response> => {
  let error: ServerError = defaultError;
  try {
    if (!req.query.email) {
      error = { status: 400, msg: 'Must include an email to check' };
      throw new Error();
    }
    const rows: any[] = await client.query('SELECT id FROM users WHERE email = $1 LIMIT 1;', req.query.email);
    const taken = rows.length > 0;
    return resp.status(200).json({ taken });
  } catch (e) {
    return resp.status(error.status).send(error.msg);
  }
};

router.route('/login').post(login);
router.route('/email-taken').get(checkEmail);
router.route('/').post(createUser);
